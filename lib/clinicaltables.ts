import { GlobalVariable } from "@/types/models/GlobalVariable";

export async function searchConditions(condition: string): Promise<string[]> {
    try {
        const response = await fetch(`https://clinicaltrials.gov/api/int/suggest?input=${encodeURIComponent(condition)}&dictionary=Condition`);
        if (!response.ok) {
            throw new Error('Failed to fetch condition suggestions');
        }
        const data = await response.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error('Error fetching condition suggestions:', error);
        return [];
    }
}

export async function searchInterventions(intervention: string): Promise<string[]> {
    try {
        const response = await fetch(`https://clinicaltrials.gov/api/int/suggest?input=${encodeURIComponent(intervention)}&dictionary=InterventionName`);
        if (!response.ok) {
            throw new Error('Failed to fetch intervention suggestions');
        }
        const data = await response.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error('Error fetching intervention suggestions:', error);
        return [];
    }
}

export async function searchSponsors(sponsor: string): Promise<string[]> {
    try {
        const response = await fetch(`https://clinicaltrials.gov/api/int/suggest?input=${encodeURIComponent(sponsor)}&dictionary=LeadSponsorName`);
        if (!response.ok) {
            throw new Error('Failed to fetch sponsor suggestions');
        }
        const data = await response.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error('Error fetching sponsor suggestions:', error);
        return [];
    }
}

export async function searchLocations(facility: string): Promise<string[]> {
    try {
        const response = await fetch(`https://clinicaltrials.gov/api/int/suggest?input=${encodeURIComponent(facility)}&dictionary=LocationFacility`);
        if (!response.ok) {
            throw new Error('Failed to fetch location suggestions');
        }
        const data = await response.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error('Error fetching location suggestions:', error);
        return [];
    }
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

export async function searchDfdaVariables(searchPhrase: string, additionalParams: Record<string, string> = {}): Promise<GlobalVariable[]> {
    try {
        const baseUrl = 'https://safe.fdai.earth/api/v3/variables';
        const params = new URLSearchParams({
            appName: 'Wishonia',
            clientId: 'oauth_test_client', 
            limit: '10',
            includePublic: 'true',
            searchPhrase,
            ...additionalParams
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
        
        const variables = data;
        
        console.log(`Found ${variables.length} variables`);
        return variables;
    } catch (error) {
        console.error("Error in searchDfdaVariables:", error);
        if (error instanceof Error) {
            console.error("Error message:", error.message);
            console.error("Error stack:", error.stack);
        }
        return [];
    }
}

export async function searchDfdaTreatments(query: string): Promise<GlobalVariable[]> {
    return searchDfdaVariables(query, {
        variableCategoryName: 'Treatments'
    });
}

export async function searchDfdaOutcomes(query: string): Promise<GlobalVariable[]> {
    return searchDfdaVariables(query, {
        outcome: 'true',
        sort: '-numberOfCorrelationsAsEffect'
    });
}

export async function searchDfdaPredictors(query: string): Promise<GlobalVariable[]> {
    return searchDfdaVariables(query, {
        sort: '-numberOfCorrelationsAsCause'
    });
}
