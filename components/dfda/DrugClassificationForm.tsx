'use client';

import React, { useState, useEffect } from 'react';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertCircle, CheckCircle, HelpCircle } from 'lucide-react';

type Classification = 'OTC' | 'PRESCRIPTION_ONLY' | 'SCHEDULE_I' | 'SCHEDULE_II' | 'SCHEDULE_III' | 'SCHEDULE_IV' | 'SCHEDULE_V' | 'UNSCHEDULED';

interface DrugClassificationProfile {
    name: string;
    efficacyRate: number;
    adverseEventRate: number;
    severeAdverseEventRate: number;
    drugInteractionIndex: number;
    therapeuticIndex: number;
    abusePotentialScore: number;
    withdrawalSeverityIndex: number;
    overdoseRiskFactor: number;
    misuseProbability: number;
    selfAdministrationSafety: number;
    accessBenefitRatio: number;
    societalCostIndex: number;
    otcScore?: number;
    prescriptionScore?: number;
    schedulingScore?: number;
    accessRestrictionBenefitScore?: number;
    finalClassificationScore?: number;
    classification?: Classification;
}

const fieldDescriptions: Record<keyof DrugClassificationProfile, string> = {
    name: "The name of the drug you're classifying",
    efficacyRate: "How well the drug works (0-100%)",
    adverseEventRate: "How often side effects occur (0-100%)",
    severeAdverseEventRate: "How often severe side effects occur (0-100%)",
    drugInteractionIndex: "How much the drug interacts with others (0-10)",
    therapeuticIndex: "Safety margin between effective and toxic dose (higher is safer)",
    abusePotentialScore: "Likelihood of drug abuse (0-100)",
    withdrawalSeverityIndex: "How bad withdrawal symptoms are (0-10)",
    overdoseRiskFactor: "How easily one could overdose (lower is safer)",
    misuseProbability: "Chance of using the drug incorrectly (0-100%)",
    selfAdministrationSafety: "How safely patients can use the drug on their own (0-10)",
    accessBenefitRatio: "Benefits vs. risks of easy access (higher means more benefit)",
    societalCostIndex: "Social and economic costs of restricting the drug (0-100)",
    otcScore: "Score determining over-the-counter eligibility",
    prescriptionScore: "Score determining prescription requirement",
    schedulingScore: "Score determining controlled substance scheduling",
    accessRestrictionBenefitScore: "Score evaluating the benefits of access restrictions",
    finalClassificationScore: "Final score used to determine the drug classification",
    classification: "The final classification of the drug"
};

const classificationDefinitions: Record<Classification, string> = {
    OTC: "Over-the-Counter: Safe enough to use without a prescription",
    PRESCRIPTION_ONLY: "Prescription Required: Needs a doctor's approval for use",
    SCHEDULE_I: "Schedule I: Illegal, no medical use, high abuse potential",
    SCHEDULE_II: "Schedule II: High abuse risk, severe psychological or physical dependence",
    SCHEDULE_III: "Schedule III: Moderate to low potential for physical and psychological dependence",
    SCHEDULE_IV: "Schedule IV: Low potential for abuse and low risk of dependence",
    SCHEDULE_V: "Schedule V: Very low potential for abuse, limited quantities of certain narcotics",
    UNSCHEDULED: "Unscheduled: Not controlled, but may still need a prescription"
};

const DrugClassificationForm: React.FC = () => {
    const [formData, setFormData] = useState<DrugClassificationProfile>({
        name: "Example Drug",
        efficacyRate: 85,
        adverseEventRate: 10,
        severeAdverseEventRate: 2,
        drugInteractionIndex: 3,
        therapeuticIndex: 6,
        abusePotentialScore: 20,
        withdrawalSeverityIndex: 4,
        overdoseRiskFactor: 1.5,
        misuseProbability: 15,
        selfAdministrationSafety: 7,
        accessBenefitRatio: 2,
        societalCostIndex: 30,
    });

    const [activeTooltip, setActiveTooltip] = useState<keyof DrugClassificationProfile | null>(null);

    const handleInputChange = (name: keyof DrugClassificationProfile, value: number | string) => {
        setFormData(prevData => ({
            ...prevData,
            [name]: name === 'name' ? value : parseFloat(value as string) || 0
        }));
    };

    useEffect(() => {
        const calculateScores = (data: DrugClassificationProfile): Partial<DrugClassificationProfile> => {
            const otcScore = (data.efficacyRate * 0.3) +
                ((100 - data.adverseEventRate) * 0.2) +
                ((100 - data.severeAdverseEventRate) * 0.2) +
                ((10 - data.drugInteractionIndex) * 10 * 0.1) +
                (data.selfAdministrationSafety * 10 * 0.2);

            const prescriptionScore = (data.efficacyRate * 0.25) +
                (data.adverseEventRate * 0.15) +
                (data.severeAdverseEventRate * 0.2) +
                (data.drugInteractionIndex * 5 * 0.1) +
                ((10 - data.selfAdministrationSafety) * 10 * 0.3);

            const schedulingScore = (data.abusePotentialScore * 0.3) +
                (data.withdrawalSeverityIndex * 10 * 0.2) +
                (data.overdoseRiskFactor * 10 * 0.2) +
                (data.misuseProbability * 0.2) +
                ((10 - data.therapeuticIndex) * 10 * 0.1);

            const accessRestrictionBenefitScore =
                ((100 - data.accessBenefitRatio) * 0.6) +
                ((100 - data.societalCostIndex) * 0.4);

            const finalClassificationScore =
                (otcScore * 0.3) +
                (prescriptionScore * 0.3) +
                (schedulingScore * 0.2) +
                (accessRestrictionBenefitScore * 0.2);

            let classification: Classification = 'UNSCHEDULED';
            if (finalClassificationScore >= 80) classification = 'SCHEDULE_II';
            else if (finalClassificationScore >= 60) classification = 'SCHEDULE_III';
            else if (finalClassificationScore >= 40) classification = 'SCHEDULE_IV';
            else if (finalClassificationScore >= 20) classification = 'SCHEDULE_V';
            else if (prescriptionScore > otcScore) classification = 'PRESCRIPTION_ONLY';
            else classification = 'OTC';

            return {
                otcScore,
                prescriptionScore,
                schedulingScore,
                accessRestrictionBenefitScore,
                finalClassificationScore,
                classification
            };
        };

        setFormData(prevData => ({
            ...prevData,
            ...calculateScores(prevData)
        }));
    }, [formData.efficacyRate, formData.adverseEventRate, formData.severeAdverseEventRate,
        formData.drugInteractionIndex, formData.selfAdministrationSafety, formData.abusePotentialScore,
        formData.withdrawalSeverityIndex, formData.overdoseRiskFactor, formData.misuseProbability,
        formData.therapeuticIndex, formData.accessBenefitRatio, formData.societalCostIndex]);

    const renderInput = (key: keyof DrugClassificationProfile) => {
        const value = formData[key];
        if (typeof value !== 'number') return null;

        const commonClasses = "w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer";

        switch (key) {
            case 'efficacyRate':
            case 'adverseEventRate':
            case 'severeAdverseEventRate':
            case 'misuseProbability':
            case 'abusePotentialScore':
            case 'societalCostIndex':
                return (
                    <input
                        type="range"
                        id={key}
                        name={key}
                        value={value}
                        onChange={(e) => handleInputChange(key, e.target.value)}
                        min="0"
                        max="100"
                        step="1"
                        className={commonClasses}
                    />
                );
            case 'drugInteractionIndex':
            case 'withdrawalSeverityIndex':
            case 'selfAdministrationSafety':
                return (
                    <input
                        type="range"
                        id={key}
                        name={key}
                        value={value}
                        onChange={(e) => handleInputChange(key, e.target.value)}
                        min="0"
                        max="10"
                        step="0.1"
                        className={commonClasses}
                    />
                );
            default:
                return (
                    <input
                        type="number"
                        id={key}
                        name={key}
                        value={value}
                        onChange={(e) => handleInputChange(key, e.target.value)}
                        className="w-24 text-right bg-gray-100 p-1 border border-black rounded"
                        step="0.01"
                    />
                );
        }
    };

    const chartData = [
        { name: 'OTC', score: formData.otcScore },
        { name: 'Prescription', score: formData.prescriptionScore },
        { name: 'Scheduling', score: formData.schedulingScore },
        { name: 'Access Restriction', score: formData.accessRestrictionBenefitScore },
        { name: 'Final', score: formData.finalClassificationScore },
    ];

    return (
        <div className="w-full max-w-4xl mx-auto bg-gradient-to-b from-blue-100 to-purple-100 p-8 font-sans">
            <h2 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-lg shadow-lg">
                DRUG CLASSIFICATION SIMULATOR
            </h2>
            <div className="bg-white p-6 mb-8 rounded-lg shadow-lg">
                <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white p-2 rounded">
                    {formData.name.toUpperCase()}
                </h3>
                <form className="space-y-6">
                    <div className="border-b-2 border-gray-200 pb-4">
                        <label htmlFor="name" className="font-bold text-lg">Drug Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className="w-full bg-gray-100 p-2 border border-gray-300 rounded mt-1"
                        />
                    </div>
                    {(Object.keys(formData) as Array<keyof DrugClassificationProfile>)
                        .filter(key => !['name', 'otcScore', 'prescriptionScore', 'schedulingScore', 'accessRestrictionBenefitScore', 'finalClassificationScore', 'classification'].includes(key))
                        .map((key) => (
                            <div key={key} className="border-b-2 border-gray-200 pb-4 relative">
                                <div className="flex justify-between items-center">
                                    <label htmlFor={key} className="font-bold text-lg flex items-center">
                                        {key.split(/(?=[A-Z])/).join(" ").replace(/\b\w/g, l => l.toUpperCase())}
                                        <HelpCircle
                                            className="ml-2 text-gray-500 cursor-help"
                                            size={20}
                                            onMouseEnter={() => setActiveTooltip(key)}
                                            onMouseLeave={() => setActiveTooltip(null)}
                                        />
                                    </label>
                                    <div className="flex items-center">
                                        {renderInput(key)}
                                        <span className="ml-2 w-16 text-right bg-gray-200 p-1 rounded">
                                            {typeof formData[key] === 'number' ? (formData[key] as number).toFixed(2) : 'N/A'}
                                        </span>
                                    </div>
                                </div>
                                {activeTooltip === key && (
                                    <div className="absolute z-10 p-2 bg-black text-white rounded shadow-lg text-sm mt-1">
                                        {fieldDescriptions[key]}
                                    </div>
                                )}
                            </div>
                        ))}
                </form>
            </div>
            <div className="bg-white p-6 mb-8 rounded-lg shadow-lg">
                <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white p-2 rounded">CLASSIFICATION RESULTS</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className={`p-4 border-4 rounded-lg ${formData.classification === 'OTC' ? 'border-green-500 bg-green-100' : 'border-gray-300 bg-gray-100'}`}>
                        <h4 className="font-bold flex items-center">
                            {formData.classification === 'OTC' ? <CheckCircle className="mr-2 text-green-500" /> : <AlertCircle className="mr-2 text-gray-500" />}
                            OVER THE COUNTER
                        </h4>
                        <p>{formData.classification === 'OTC' ? 'YES' : 'NO'}</p>
                    </div>
                    <div className={`p-4 border-4 rounded-lg ${formData.classification === 'PRESCRIPTION_ONLY' ? 'border-yellow-500 bg-yellow-100' : 'border-gray-300 bg-gray-100'}`}>
                        <h4 className="font-bold flex items-center">
                            {formData.classification === 'PRESCRIPTION_ONLY' ? <CheckCircle className="mr-2 text-yellow-500" /> : <AlertCircle className="mr-2 text-gray-500" />}
                            PRESCRIPTION REQUIRED
                        </h4>
                        <p>{formData.classification === 'PRESCRIPTION_ONLY' ? 'YES' : 'NO'}</p>
                    </div>
                    <div className={`p-4 border-4 rounded-lg ${['SCHEDULE_I', 'SCHEDULE_II', 'SCHEDULE_III', 'SCHEDULE_IV', 'SCHEDULE_V'].includes(formData.classification || '') ? 'border-red-500 bg-red-100' : 'border-gray-300 bg-gray-100'}`}>
                        <h4 className="font-bold flex items-center">
                            {['SCHEDULE_I', 'SCHEDULE_II', 'SCHEDULE_III', 'SCHEDULE_IV', 'SCHEDULE_V'].includes(formData.classification || '') ? <CheckCircle className="mr-2 text-red-500" /> : <AlertCircle className="mr-2 text-gray-500" />}
                            DEA SCHEDULING
                        </h4>
                        <p>{(formData.classification || 'UNSCHEDULED').replace('_', ' ')}</p>
                    </div>
                </div>
                <div className="mt-4 p-4 bg-gray-100 border-2 border-gray-300 rounded-lg">
                    <h4 className="font-bold">CLASSIFICATION DEFINITION:</h4>
                    <p className="text-sm mt-2">{classificationDefinitions[formData.classification || 'UNSCHEDULED']}</p>
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white p-2 rounded">SCORE BREAKDOWN</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="score" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-4">
                    <div>
                        <h4 className="font-bold">OTC Score:</h4>
                        <InlineMath math={`${formData.otcScore?.toFixed(2)} = (\\text{Efficacy Rate: }${formData.efficacyRate} * 0.3) + ((100 - \\text{Adverse Event Rate: }${formData.adverseEventRate}) * 0.2) + ((100 - \\text{Severe Adverse Event Rate: }${formData.severeAdverseEventRate}) * 0.2) + ((10 - \\text{Drug Interaction Index: }${formData.drugInteractionIndex}) * 10 * 0.1) + (\\text{Self Administration Safety: }${formData.selfAdministrationSafety} * 10 * 0.2)`} />
                    </div>
                    <div>
                        <h4 className="font-bold">Prescription Score:</h4>
                        <InlineMath math={`${formData.prescriptionScore?.toFixed(2)} = (\\text{Efficacy Rate: }${formData.efficacyRate} * 0.25) + (\\text{Adverse Event Rate: }${formData.adverseEventRate} * 0.15) + (\\text{Severe Adverse Event Rate: }${formData.severeAdverseEventRate} * 0.2) + (\\text{Drug Interaction Index: }${formData.drugInteractionIndex} * 5 * 0.1) + ((10 - \\text{Self Administration Safety: }${formData.selfAdministrationSafety}) * 10 * 0.3)`} />
                    </div>
                    <div>
                        <h4 className="font-bold">Scheduling Score:</h4>
                        <InlineMath math={`${formData.schedulingScore?.toFixed(2)} = (\\text{Abuse Potential Score: }${formData.abusePotentialScore} * 0.3) + (\\text{Withdrawal Severity Index: }${formData.withdrawalSeverityIndex} * 10 * 0.2) + (\\text{Overdose Risk Factor: }${formData.overdoseRiskFactor} * 10 * 0.2) + (\\text{Misuse Probability: }${formData.misuseProbability} * 0.2) + ((10 - \\text{Therapeutic Index: }${formData.therapeuticIndex}) * 10 * 0.1)`} />
                    </div>
                    <div>
                        <h4 className="font-bold">Access Restriction Benefit Score:</h4>
                        <InlineMath math={`${formData.accessRestrictionBenefitScore?.toFixed(2)} = ((100 - \\text{Access Benefit Ratio: }${formData.accessBenefitRatio}) * 0.6) + ((100 - \\text{Societal Cost Index: }${formData.societalCostIndex}) * 0.4)`} />
                    </div>
                    <div>
                        <h4 className="font-bold">Final Classification Score:</h4>
                        <InlineMath math={`${formData.finalClassificationScore?.toFixed(2)} = (\\text{OTC Score: }${formData.otcScore?.toFixed(2)} * 0.3) + (\\text{Prescription Score: }${formData.prescriptionScore?.toFixed(2)} * 0.3) + (\\text{Scheduling Score: }${formData.schedulingScore?.toFixed(2)} * 0.2) + (\\text{Access Restriction Benefit Score: }${formData.accessRestrictionBenefitScore?.toFixed(2)} * 0.2)`} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DrugClassificationForm;