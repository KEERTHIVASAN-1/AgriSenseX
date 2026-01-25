"use client";

const BROKER_URL = "wss://m280d11d.ala.dedicated.aws.emqxcloud.com:8084/mqtt";
const MQTT_SCRIPT_SRC = "https://unpkg.com/mqtt/dist/mqtt.min.js";

declare global {
  interface Window {
    mqtt?: {
      connect: (
        url: string,
        options?: {
          username?: string;
          password?: string;
          clientId?: string;
          clean?: boolean;
          reconnectPeriod?: number;
        }
      ) => MqttClientLike;
    };
  }
}

export type MqttClientLike = {
  on: (event: string, listener: (...args: unknown[]) => void) => void;
  off?: (event: string, listener: (...args: unknown[]) => void) => void;
  subscribe: (topic: string, callback?: (err: unknown) => void) => void;
  unsubscribe: (topic: string) => void;
  publish: (topic: string, message: string | Uint8Array) => void;
};

let mqttClient: MqttClientLike | null = null;
let mqttClientPromise: Promise<MqttClientLike | null> | null = null;

async function loadMqttScript(): Promise<void> {
  if (typeof window === "undefined") return;
  if (window.mqtt) return;

  await new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${MQTT_SCRIPT_SRC}"]`
    );
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("MQTT script failed to load")), {
        once: true,
      });
      return;
    }

    const script = document.createElement("script");
    script.src = MQTT_SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("MQTT script failed to load"));
    document.head.appendChild(script);
  });
}

export async function getMqttClient(): Promise<MqttClientLike | null> {
  if (typeof window === "undefined") {
    return null;
  }

  if (mqttClient) {
    return mqttClient;
  }

  if (!mqttClientPromise) {
    mqttClientPromise = (async () => {
      try {
        await loadMqttScript();
        if (!window.mqtt) {
          console.error("MQTT library not available on window");
          return null;
        }

        const client = window.mqtt.connect(BROKER_URL, {
          username: "agrisense",
          password: "Agr!12345",
          clientId: "agri_web_" + Math.random().toString(16).substr(2, 8),
          clean: true,
          reconnectPeriod: 2000,
        });

        return await new Promise<MqttClientLike | null>((resolve) => {
          let resolved = false;

          client.on("connect", () => {
            if (!resolved) {
              resolved = true;
              mqttClient = client;
              resolve(client);
            }
          });

          client.on("error", (err: unknown) => {
            console.error("MQTT connection error:", err);
            if (!resolved) {
              resolved = true;
              resolve(client);
            }
          });

          // Safety timeout in case connect event is never fired
          setTimeout(() => {
            if (!resolved) {
              resolved = true;
              mqttClient = client;
              resolve(client);
            }
          }, 5000);
        });
      } catch (err) {
        console.error("Failed to initialize MQTT client:", err);
        return null;
      }
    })();
  }

  return mqttClientPromise;
}

export async function publishMessage(topic: string, payload: unknown): Promise<void> {
  if (typeof window === "undefined") return;

  const client = await getMqttClient();
  if (!client) return;

  try {
    const message =
      typeof payload === "string" || payload instanceof Uint8Array
        ? payload
        : JSON.stringify(payload);
    client.publish(topic, message);
  } catch (err) {
    console.error("Error publishing MQTT message:", err);
  }
}

export type MqttMessageHandler = (payload: string) => void;

export function subscribeToTopic(
  topic: string,
  handler: MqttMessageHandler
): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  let isActive = true;
  let messageListener: ((t: string, message: Uint8Array | string) => void) | null = null;

  getMqttClient().then((client) => {
    if (!client || !isActive) return;

    messageListener = (t: string, message: Uint8Array | string) => {
      if (t !== topic) return;

      try {
        let text: string;
        if (typeof (message as string | Uint8Array) === "string") {
          text = message as string;
        } else {
          text = new TextDecoder().decode(message as Uint8Array);
        }
        handler(text);
      } catch (err) {
        console.error("Error handling MQTT message:", err);
      }
    };

    client.on("message", messageListener);

    client.subscribe(topic, (err: unknown) => {
      if (err) {
        console.error(`Failed to subscribe to topic ${topic}:`, err);
      }
    });
  });

  return () => {
    isActive = false;

    if (!mqttClient || !messageListener) return;

    try {
      mqttClient.unsubscribe(topic);
      mqttClient.off("message", messageListener);
    } catch (err) {
      console.error("Error during MQTT unsubscribe:", err);
    }
  };
}


