export async function searchConditions(condition: string): Promise<string[]> {
    const response = await fetch(`https://clinicaltables.nlm.nih.gov/api/conditions/v3/search?terms=${condition}&ef=name`);
    const data = await response.json();
    // Extract the suggestions from the fourth element of the array
    return data[3].map((item: string[]) => item[0]);
}