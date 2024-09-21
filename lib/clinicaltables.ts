import { GlobalVariable } from "@/types/models/GlobalVariable";

export async function searchConditions(condition: string): Promise<string[]> {
    const response = await fetch(`https://clinicaltables.nlm.nih.gov/api/conditions/v3/search?terms=${condition}&ef=name`);
    const data = await response.json();
    // Extract the suggestions from the fourth element of the array
    return data[3].map((item: string[]) => item[0]);
}

export async function searchClinicalTrialsGovInterventions(intervention: string): Promise<string[]> {
    // Find matching interventions with the clinicaltrials.gov api
    // Example: https://clinicaltrials.gov/api/query/study_fields?expr=INTERVENTION.INTERVENTION_NAME:*aspirin*&fields=NCTId,InterventionName&fmt=json
    const response = await fetch(`https://clinicaltrials.gov/api/query/study_fields?expr=INTERVENTION.INTERVENTION_NAME:*${intervention}*&fields=NCTId,InterventionName&fmt=json`);
    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, statusText: ${response.statusText}, body: ${errorBody}`);
    }
    const data = await response.json();
    return data.StudyFieldsResponse.StudyFields.map((item: any) => item.InterventionName);
}

export async function searchFdaTreatments(treatment: string): Promise<string[]> {
    try {
        const encodedTreatment = encodeURIComponent(treatment);
        const response = await fetch(`https://api.fda.gov/drug/label.json?search=indications_and_usage:"${encodedTreatment}"&limit=10`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.results || !Array.isArray(data.results)) {
            return [];
        }
        
        return data.results
            .filter((item: any) => item.openfda && item.openfda.brand_name)
            .map((item: any) => item.openfda.brand_name[0]);
    } catch (error) {
        console.error("Error in searchFdaTreatments:", error);
        return [];
    }
}

export async function searchDfdaTreatments(treatment: string): Promise<string[]> {
    try {
        const baseUrl = 'https://safe.fdai.earth/api/v3/variables';
        const params = new URLSearchParams({
            appName: 'Wishonia',
            clientId: 'oauth_test_client',
            limit: '10',
            includePublic: 'true',
            variableCategoryName: 'Treatments',
            searchPhrase: treatment,
        });

        const url = `${baseUrl}?${params.toString()}`;
        console.log(`Fetching from URL: ${url}`);

        const response = await fetch(url);
        
        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, statusText: ${response.statusText}, body: ${errorBody}`);
        }
        
        const data = await response.json();
        
        if (!Array.isArray(data)) {
            console.error('Unexpected response structure:', JSON.stringify(data, null, 2));
            throw new Error("Unexpected response format: 'data' field is missing or not an array");
        }
        
        const treatments = data.map((item: GlobalVariable) => item.name);
        
        console.log(`Found ${treatments.length} treatments`);
        return treatments;
    } catch (error) {
        console.error("Error in searchTreatments:", error);
        if (error instanceof Error) {
            console.error("Error message:", error.message);
            console.error("Error stack:", error.stack);
        }
        return [];
    }
}

