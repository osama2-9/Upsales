
export const validate = (schema, source = "body") => (req, res, next) => {
  try {
    const parsed = schema.safeParse(req[source]);

    if (!parsed.success) {
      const errorArray = parsed.error.errors || [];

      const formattedErrors = errorArray.map((error) => {
        const field = error.path?.length ? error.path.join(".") : "root";
        let message = error.message || "Validation error";

        switch (error.code) {
          case "invalid_type":
            message = `Expected ${error.expected}, but received ${error.received}`;
            break;
          case "too_small":
            message = error.type === "string"
              ? `Must be at least ${error.minimum} characters`
              : `Must be at least ${error.minimum}`;
            break;
          case "too_big":
            message = error.type === "string"
              ? `Must be at most ${error.maximum} characters`
              : `Must be at most ${error.maximum}`;
            break;
          case "invalid_string":
            message = error.validation === "email"
              ? "Please enter a valid email address"
              : `Invalid ${error.validation} format`;
            break;
        }

        return {
          field,
          message,
          code: error.code || "unknown",
        };
      });

      return res.status(400).json({
        error: "Validation failed",
        issues: formattedErrors,
      });
    }

    if (source === "body") {
      req.body = parsed.data;
    }

    next();
  } catch (err) {
    console.error("Unexpected error during validation:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
