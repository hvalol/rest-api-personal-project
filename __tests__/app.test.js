describe("Sample Test Suite", () => {
  it("should fail due to a syntax error", () => {
    const message = "This will cause a syntax error";
    expect(message).toBe("This will cause a syntax error");
  }; // <-- Syntax error: Extra semicolon
});