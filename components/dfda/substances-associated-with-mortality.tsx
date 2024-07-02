'use client';

import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Info } from 'lucide-react';

interface SubstanceMortalityData {
  category: string;
  annualDeaths: number;
  description: string;
}

const SubstanceMortalityInfo: React.FC = () => {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const mortalityData: SubstanceMortalityData[] = [
    {
      category: "Tobacco (Cigarettes)",
      annualDeaths: 8000000,
      description: "Leading cause of preventable death. Linked to various cancers, cardiovascular diseases, and respiratory disorders."
    },
    {
      category: "Alcohol",
      annualDeaths: 3000000,
      description: "Associated with liver disease, certain cancers, cardiovascular issues, and accidental deaths."
    },
    {
      category: "High Sodium Foods",
      annualDeaths: 3000000,
      description: "Excessive sodium intake is linked to hypertension, increasing the risk of cardiovascular diseases."
    },
    {
      category: "Processed Meats",
      annualDeaths: 900000,
      description: "Regular consumption is associated with increased risk of colorectal cancer and cardiovascular diseases."
    },
    {
      category: "Trans Fat Foods",
      annualDeaths: 500000,
      description: "Strongly associated with heart disease and stroke."
    },
    {
      category: "Undercooked or Raw Foods",
      annualDeaths: 420000,
      description: "Can lead to foodborne illnesses, particularly dangerous in regions with limited healthcare access."
    },
    {
      category: "Sugar-Sweetened Beverages",
      annualDeaths: 184000,
      description: "Linked to obesity, type 2 diabetes, and cardiovascular diseases."
    }
  ];

  mortalityData.sort((a, b) => b.annualDeaths - a.annualDeaths);

  return (
    <div className="w-full max-w-4xl mx-auto bg-gradient-to-b from-red-100 to-yellow-100 p-8 font-sans">
      <h2 className="text-4xl font-bold text-center mb-8 bg-red-600 text-white p-4 rounded-lg shadow-lg">
        Substances Associated with Highest Mortality Rates
      </h2>

      <div className="bg-white p-6 mb-8 rounded-lg shadow-lg">
        <h3 className="text-2xl font-bold mb-4 bg-red-500 text-white p-2 rounded">
          Important Note
        </h3>
        <p className="mb-4">
          This information is based on global estimates and scientific studies. It's crucial to understand that:
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>These numbers represent deaths associated with long-term consumption patterns and substance use.</li>
          <li>The data includes both foods and other consumed substances like tobacco and alcohol.</li>
          <li>The data can vary based on study methodology, population, and other factors.</li>
          <li>Individual risk depends on overall diet, lifestyle, genetics, and other health factors.</li>
          <li>For foods, moderation and a balanced diet are key to healthy eating.</li>
          <li>For substances like tobacco and alcohol, health organizations generally recommend avoidance or strict limitation.</li>
        </ul>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-2xl font-bold mb-4 bg-red-500 text-white p-2 rounded">
          Estimated Annual Deaths Associated with Substances and Food Categories
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={mortalityData} layout="vertical">
            <XAxis type="number" />
            <YAxis dataKey="category" type="category" width={150} />
            <Tooltip />
            <Legend />
            <Bar dataKey="annualDeaths" fill="#FF6B6B" />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-8 space-y-4">
          {mortalityData.map((item, index) => (
            <div key={index} className="border-b last:border-b-0 pb-4">
              <div className="flex items-center">
                <h4 className="text-xl font-bold">{item.category}</h4>
                <Info
                  className="ml-2 text-gray-500 cursor-help"
                  size={20}
                  onMouseEnter={() => setActiveTooltip(item.category)}
                  onMouseLeave={() => setActiveTooltip(null)}
                />
              </div>
              <p><strong>Estimated Annual Deaths:</strong> {item.annualDeaths.toLocaleString()}</p>
              {activeTooltip === item.category && (
                <div className="mt-2 p-2 bg-gray-100 rounded-lg">
                  <p>{item.description}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 mt-8 rounded-lg shadow-lg">
        <h3 className="text-2xl font-bold mb-4 bg-red-500 text-white p-2 rounded">
          Context is Key
        </h3>
        <p>
          These statistics reflect global patterns and don't necessarily apply to individuals. For foods, a balanced diet, regular exercise, 
          and overall healthy lifestyle are crucial for reducing health risks. For substances like tobacco and alcohol, health organizations 
          generally recommend avoidance or strict limitation due to their significant health risks. Always consult with healthcare professionals 
          for personalized advice on diet and substance use.
        </p>
      </div>
    </div>
  );
};

export default SubstanceMortalityInfo;
