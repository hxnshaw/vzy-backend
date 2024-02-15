require("dotenv").config();
const bodyParser = require("body-parser");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.charges = async (req, res) => {
  try {
    const { email, amount } = req.body;
    const customer = await stripe.customers.create({ email });
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, 
      currency: "usd",
      customer: customer.id,
    });
    res.status(200).json({ message: "success", paymentIntent });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// I DID NOT HAVE ENOUGH TIME TO FIGURE OUT HOW TO SET UP THE STRIPE WEBHOOK BEFORE THE TASK DEADLINE.
exports.verifyPayment =
  (bodyParser.raw({ type: "application/json" }),
  async (request, response) => {
    const sig = request.headers["stripe-signature"];
    const body = request.body;

    let event = null;

    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
      // invalid signature
      response.status(400).send(err);
      return;
    }

    let intent = null;
    switch (event["type"]) {
      case "payment_intent.succeeded":
        intent = event.data.object;
        console.log("Succeeded:", intent.id);
        break;
      case "payment_intent.payment_failed":
        intent = event.data.object;
        const message =
          intent.last_payment_error && intent.last_payment_error.message;
        console.log("Failed:", intent.id, message);
        break;
    }

    response.sendStatus(200);
  });
