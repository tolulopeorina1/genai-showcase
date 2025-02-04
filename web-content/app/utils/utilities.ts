export function generateRandomNumber(
  min: number = 3.5,
  max: number = 5.0
): number {
  const step = 0.1; // Increment by 0.1
  const factor = Math.round((max - min) / step); // Calculate total steps
  const randomStep = Math.floor(Math.random() * (factor + 1)); // Get a random step
  return parseFloat((min + randomStep * step).toFixed(1)); // Generate and fix to 1 decimal
}
