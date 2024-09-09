import {getConditionByName} from "@/app/dfda/dfdaActions";
import TreatmentList from "@/app/dfda/components/TreatmentList";


export default async function ConditionPage({ params }: { params: { conditionName: string } }) {
    // Decode the conditionName from the URL
    const decodedConditionName = decodeURIComponent(params.conditionName);
    
    const condition = await getConditionByName(decodedConditionName)

    if (!condition) {
        return <div>Condition not found</div>
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">{condition.name}</h1>
            <TreatmentList condition={condition} />
        </div>
    )
}