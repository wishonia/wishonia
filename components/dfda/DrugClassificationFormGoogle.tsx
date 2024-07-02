'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

type Classification = 'OTC' | 'PRESCRIPTION_ONLY' | 'SCHEDULE_I' | 'SCHEDULE_II' | 'SCHEDULE_III' | 'SCHEDULE_IV' | 'SCHEDULE_V' | 'UNSCHEDULED';

interface DrugClassificationProfile {
    id?: number;
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

// Simplified Field Descriptions:
const fieldDescriptions: Record<keyof DrugClassificationProfile, string> = {
    id: "Unique identifier for the drug",
    name: "Name of the drug",
    efficacyRate: "How well the drug works (higher is better)",
    adverseEventRate: "Chance of side effects (lower is better)",
    severeAdverseEventRate: "Chance of serious side effects (lower is better)",
    drugInteractionIndex:
        'Likelihood of interacting with other medications (lower is better)',
    therapeuticIndex:
        "Safety margin - how much higher the dangerous dose is than the effective dose (higher is safer)",
    abusePotentialScore: 'Potential for addiction (lower is better)',
    withdrawalSeverityIndex: 'Severity of withdrawal symptoms (lower is better)',
    overdoseRiskFactor: 'Risk of overdose (lower is better)',
    misuseProbability: 'Likelihood of being misused (lower is better)',
    selfAdministrationSafety:
        'Safety when taken without medical supervision (higher is safer)',
    accessBenefitRatio: 'Benefits vs. risks of easy access (higher is better)',
    societalCostIndex:
        'Cost to society if access is restricted (lower is better)',
    otcScore:
        'Over-the-Counter Score. Formula: OTC Score = (ER * 0.3) + ((100 - AER) * 0.2) + ((100 - SAER) * 0.2) + ((10 - DII) * 10 * 0.1) + (SAS * 10 * 0.2)',
    prescriptionScore:
        'Prescription-Only Score. Formula: Prescription Score = (ER * 0.25) + (AER * 0.15) + (SAER * 0.2) + (DII * 5 * 0.1) + ((10 - SAS) * 10 * 0.3)',
    schedulingScore:
        'DEA Scheduling Score. Formula: Scheduling Score = (APS * 0.3) + (WSI * 10 * 0.2) + (ORF * 10 * 0.2) + (MP * 0.2) + ((10 - TI) * 10 * 0.1)',
    accessRestrictionBenefitScore:
        'Access Restriction Benefit Score. Formula: ARBS = (100 - ABR) * 0.6 + (100 - SCI) * 0.4',
    finalClassificationScore:
        'Final Classification Score. Formula: FCS = (OTC Score * 0.3) + (Prescription Score * 0.3) + (Scheduling Score * 0.2) + (ARBS * 0.2)',
    classification: 'Final classification of the drug based on the calculated scores',
};

// User-Friendly Classification Definitions
const classificationDefinitions: Record<Classification, string> = {
    OTC: "Over-the-Counter: Available without a prescription because it's considered safe and easy to use.",
    PRESCRIPTION_ONLY:
        'Prescription Required: Requires a doctor\'s prescription due to potential risks or the need for medical supervision.',
    SCHEDULE_I:
        "Schedule I: Illegal drugs with no currently accepted medical use and a high potential for abuse, like heroin.",
    SCHEDULE_II:
        'Schedule II: Drugs with a high potential for abuse and dependence, but with some accepted medical use, like morphine.',
    SCHEDULE_III:
        'Schedule III: Drugs with moderate potential for abuse and dependence, like some codeine-containing medications.',
    SCHEDULE_IV:
        'Schedule IV: Drugs with a lower potential for abuse and dependence, like some anxiety medications.',
    SCHEDULE_V:
        'Schedule V: Drugs with the lowest potential for abuse and dependence, often containing limited amounts of narcotics.',
    UNSCHEDULED:
        "Unscheduled: Not controlled under the Controlled Substances Act, but might still need a prescription.",
};

// Component: Gauge
const Gauge: React.FC<{
    value: number;
    min: number;
    max: number;
    color: string;
    label: string;
}> = ({ value, min, max, color, label }) => {
    const percentage = ((value - min) / (max - min)) * 100;

    return (
        <div className="relative w-full h-8 rounded-full bg-gray-300 overflow-hidden">
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }} // Add smooth transition
                className="absolute top-0 left-0 h-full bg-current rounded-full"
                style={{ backgroundColor: color }}
            />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-bold text-xs">
                {label}: {value}
            </div>
        </div>
    );
};

// ... (DrugClassificationForm component)

const DrugClassificationFormGoogle: React.FC = () => {
    // ... (Your DrugClassificationProfile state)
    const [formData, setFormData] = useState<DrugClassificationProfile>({
        name: 'Example Drug',
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

    // ... (Your handleInputChange, calculateScores, handleSubmit logic)

    // Function to handle input changes
    const handleInputChange = (
        key: keyof DrugClassificationProfile,
        value: string
    ) => {
        setFormData({
            ...formData,
            [key]: parseFloat(value),
        });
    };

    // Function to calculate classification scores
    function calculateScores(profile: DrugClassificationProfile): DrugClassificationProfile {
        // ... (Your score calculation logic)
        return profile;
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const updatedProfile = calculateScores(formData);
        setFormData(updatedProfile);
    }

    // Function to render the input fields (modified)
    const renderInput = (key: keyof DrugClassificationProfile) => {
        const value = formData[key];
        if (typeof value !== 'number') return null;

        const commonInputProps = {
            id: key,
            name: key,
            value: value,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                handleInputChange(key, e.target.value),
            className:
                'w-24 text-right bg-gray-100 p-1 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
        };

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
                        {...commonInputProps}
                        min="0"
                        max="100"
                        step="1"
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" // Style the range input
                    />
                );
            case 'drugInteractionIndex':
            case 'withdrawalSeverityIndex':
            case 'selfAdministrationSafety':
                return (
                    <input
                        type="range"
                        {...commonInputProps}
                        min="0"
                        max="10"
                        step="0.1"
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" // Style the range input
                    />
                );
            default:
                return (
                    <input
                        type="number"
                        {...commonInputProps}
                        step="0.01"
                    />
                );
        }
    };


    return (
        <div className="w-full max-w-4xl mx-auto bg-gray-100 p-8 font-sans rounded-lg shadow-md">
            {/* Title */}
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
                Understand Drug Classification
            </h1>

            {/* Input Section */}
            <div className="bg-white p-6 mb-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">
                    Drug Profile: {formData.name}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-lg font-medium text-gray-700">
                            Drug Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className="mt-1 p-2 w-full border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Render other input fields */}
                    {(Object.keys(formData) as Array<keyof DrugClassificationProfile>)
                        .filter(
                            (key) =>
                                ![
                                    'id',
                                    'name',
                                    'otcScore',
                                    'prescriptionScore',
                                    'schedulingScore',
                                    'accessRestrictionBenefitScore',
                                    'finalClassificationScore',
                                    'classification',
                                ].includes(key)
                        )
                        .map((key) => (
                            <div key={key}>
                                <label
                                    htmlFor={key}
                                    className="block text-lg font-medium text-gray-700"
                                >
                                    {key
                                        .split(/(?=[A-Z])/)
                                        .join(' ')
                                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        {/* You can add an icon here if needed */}
                                    </div>
                                    {renderInput(key)}
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <span className="text-gray-500 sm:text-sm">
                      {typeof formData[key] === 'number' &&
                      formData[key] !== null
                          ? (formData[key] as number).toFixed(2)
                          : 'N/A'}
                    </span>
                                    </div>
                                </div>
                                <p className="text-sm mt-1 text-gray-500">
                                    {fieldDescriptions[key]}
                                </p>
                            </div>
                        ))}

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    >
                        Calculate Classification
                    </button>
                </form>
            </div>

            {/* Results Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white p-6 mb-8 rounded-lg shadow-md"
            >
                <h2 className="text-2xl font-bold mb-4 text-gray-800">
                    Classification Results
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className={`p-4 border-4 rounded-lg ${
                            formData.classification === 'OTC'
                                ? 'border-green-500 bg-green-100'
                                : 'border-gray-400 bg-gray-100'
                        }`}
                    >
                        <h4 className="font-bold text-lg text-gray-800">
                            Over-the-Counter
                        </h4>
                        <p className="text-gray-700 font-semibold">
                            {formData.classification === 'OTC' ? 'Yes' : 'No'}
                        </p>
                    </motion.div>
                    {/* Prescription Required */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }} // Add a slight delay
                        className={`p-4 border-4 rounded-lg ${
                            formData.classification === 'PRESCRIPTION_ONLY'
                                ? 'border-yellow-500 bg-yellow-100'
                                : 'border-gray-400 bg-gray-100'
                        }`}
                    >
                        <h4 className="font-bold text-lg text-gray-800">
                            Prescription Required
                        </h4>
                        <p className="text-gray-700 font-semibold">
                            {formData.classification === 'PRESCRIPTION_ONLY' ? 'Yes' : 'No'}
                        </p>
                    </motion.div>
                    {/* DEA Scheduling */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }} // Add a slight delay
                        className={`p-4 border-4 rounded-lg ${
                            ['SCHEDULE_I', 'SCHEDULE_II', 'SCHEDULE_III', 'SCHEDULE_IV', 'SCHEDULE_V'].includes(
                                formData.classification || ''
                            )
                                ? 'border-red-500 bg-red-100'
                                : 'border-gray-400 bg-gray-100'
                        }`}
                    >
                        <h4 className="font-bold text-lg text-gray-800">
                            DEA Scheduling
                        </h4>
                        <p className="text-gray-700 font-semibold">
                            {(formData.classification || 'UNSCHEDULED').replace('_', ' ')}
                        </p>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginTop: '1rem' }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="mt-6 p-4 bg-gray-200 rounded-lg"
                >
                    <h4 className="font-bold text-lg text-gray-800">
                        Classification Definition:
                    </h4>
                    <p className="text-gray-700">
                        {classificationDefinitions[formData.classification || 'UNSCHEDULED']}
                    </p>
                </motion.div>
            </motion.div>

            {/* Gauge Visualization Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">
                    Visual Breakdown
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Efficacy Rate */}
                    <Gauge
                        value={formData.efficacyRate}
                        min={0}
                        max={100}
                        color="green" // Higher efficacy is good
                        label="Effectiveness"
                    />
                    {/* Adverse Event Rate */}
                    <Gauge
                        value={formData.adverseEventRate}
                        min={0}
                        max={100}
                        color="red" // Higher adverse events are bad
                        label="Side Effects"
                    />
                    {/* ... Add more Gauges for other relevant factors ... */}
                    {/* Example: */}
                    <Gauge
                        value={formData.abusePotentialScore}
                        min={0}
                        max={100}
                        color="orange"
                        label="Abuse Potential"
                    />
                    <Gauge
                        value={formData.therapeuticIndex}
                        min={0}
                        max={10}
                        color="blue" // Higher therapeutic index is generally better
                        label="Safety Margin"
                    />
                    {/* ... Add more Gauges as needed ... */}
                </div>
            </div>
        </div>
    );
};

export default DrugClassificationFormGoogle;