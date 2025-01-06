/**
 * Generates a fake user for testing purposes with consistent ID, email, and name
 */
export function generateTestDfdaUser(index: number) {
  return {
    id: `dfda_user_${index}`,
    email: `dfda_user_${index}@example.com`,
    name: `DFDA User ${index}`,
  }
} 