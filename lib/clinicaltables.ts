
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


