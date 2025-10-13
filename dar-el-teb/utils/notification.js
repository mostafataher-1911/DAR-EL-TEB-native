import fetch from "node-fetch";

export async function sendNewOfferNotification(pushTokens) {
  const messages = pushTokens.map(token => ({
    to: token,
    sound: "default",
    title: "عرض جديد",
    body: "لدينا عرض خاص اليوم! تحقق منه الآن",
    data: { screen: "Offers" }
  }));

  const chunks = []; // لو العدد كبير ممكن تعمل تقسيم

  for (let message of messages) {
    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message)
    });
  }
}
