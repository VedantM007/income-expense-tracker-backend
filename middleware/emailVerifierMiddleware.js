const verifyEmailMiddleware = async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const { default: EmailVerifier } = await import('node-email-verifier');

    // Call the appropriate method from the library
    const result = await EmailVerifier.verify(email);

    if (result.valid) {
      next();
    } else {
      res.status(400).json({ error: 'Entered Email does not exist.' });
    }
  } catch (error) {
    console.error(`Email verification error: ${error.message}`);
    res.status(500).json({ error: 'Failed to verify email. Please try again later.' });
  }
};

module.exports = verifyEmailMiddleware;
