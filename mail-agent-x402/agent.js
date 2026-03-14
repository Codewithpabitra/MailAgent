require("dotenv").config();
const fs = require("fs");
const csv = require("csv-parser");

const SERVER = "http://localhost:3000";

async function payAndSendEmail(recipient) {
  console.log(`\n📧 Processing: ${recipient.name} (${recipient.email})`);

  const payRes = await fetch(`${SERVER}/pay`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: recipient.email }),
  });
  const { token } = await payRes.json();
  console.log(`💰 Payment token received`);

  const sendRes = await fetch(`${SERVER}/send-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-payment-token": token,
    },
    body: JSON.stringify(recipient),
  });

  const result = await sendRes.json();
  if (result.success) {
    console.log(`✅ Email sent to ${recipient.email}`);
    console.log(`📝 Preview: ${result.body.slice(0, 100)}...`);
  } else {
    console.log(`❌ Failed:`, result);
  }
}

async function runAgent() {
  const recipients = [];

  await new Promise((resolve) => {
    fs.createReadStream("recipients.csv")
      .pipe(csv())
      .on("data", (row) => recipients.push(row))
      .on("end", resolve);
  });

  console.log(`📋 Found ${recipients.length} recipients`);

  for (const recipient of recipients) {
    await payAndSendEmail(recipient);
    await new Promise((r) => setTimeout(r, 1500));
  }

  console.log("\n🎉 All done!");
}

runAgent().catch(console.error);