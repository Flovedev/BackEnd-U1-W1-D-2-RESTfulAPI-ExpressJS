import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_KEY);

export const sendsRegistrationEmail = async (recipientAdress) => {
  const msg = {
    to: recipientAdress,
    from: process.env.SENDER_EMAIL_ADDRESS,
    subject: "First email sent!",
    text: "testing",
    html: "<strong>Amo alla flamenco</strong>",
  };
  await sgMail.send(msg);
};
