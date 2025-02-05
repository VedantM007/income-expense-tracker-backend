const EmailVerifier = require('node-email-verifier');

const verifyEmailMiddleware = async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    // Create a verifier instance
    const verifier = new EmailVerifier();

    // Verify the email address
    const result = await verifier.verify(email);

    // Check verification results
    if (result.valid) {
      next(); // Proceed to the next middleware or controller
    } else {
      res.status(400).json({
        error: 'Entered Email does not exists.',
      });
    }
  } catch (error) {
    console.error(`Email verification error: ${error.message}`);
    res.status(500).json({ error: 'Failed to verify email. Please try again later.' });
  }
};

module.exports = verifyEmailMiddleware;
