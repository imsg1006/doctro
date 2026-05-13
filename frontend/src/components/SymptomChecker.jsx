import React, { useState } from 'react';
import { Search, AlertTriangle, Info, CheckCircle2, ArrowRight, Stethoscope, Activity } from 'lucide-react';

const symptomData = {
  "headache": {
    causes: ["Stress", "Dehydration", "Tension", "Migraine"],
    advice: "Rest in a quiet, dark room. Stay hydrated. If persistent or severe, consult a doctor.",
    risk: "Low"
  },
  "fever": {
    causes: ["Viral Infection", "Flu", "Common Cold", "Inflammation"],
    advice: "Monitor your temperature. Stay hydrated. Rest. Seek medical help if it exceeds 103°F (39.4°C).",
    risk: "Medium"
  },
  "cough": {
    causes: ["Common Cold", "Allergies", "Bronchitis", "Post-nasal drip"],
    advice: "Stay hydrated. Use a humidifier. If accompanied by difficulty breathing, seek urgent care.",
    risk: "Low"
  },
  "chest pain": {
    causes: ["Heart-related issues", "Muscle strain", "Acid reflux", "Anxiety"],
    advice: "Seek immediate emergency medical attention if the pain is severe, crushing, or accompanied by shortness of breath.",
    risk: "High"
  },
  "stomach pain": {
    causes: ["Indigestion", "Gas", "Food poisoning", "Stomach flu"],
    advice: "Avoid solid foods for a few hours. Sip water. Consult a doctor if pain is severe or localized.",
    risk: "Medium"
  },
  "sore throat": {
    causes: ["Viral infection", "Streptococcus", "Allergies"],
    advice: "Gargle with warm salt water. Drink warm fluids. Rest your voice.",
    risk: "Low"
  },
  "pain": {
    causes: ["Excessive load", "Irregular Sleep Position"],
    advice: "Rest the area and avoid movement that worsen it",
    risk: "Low"
  }
};

const SymptomChecker = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeSymptoms = () => {
    if (!input.trim()) return;

    setLoading(true);
    // Simulate AI processing
    setTimeout(() => {
      const lowerInput = input.toLowerCase();
      let found = null;

      for (const [key, data] of Object.entries(symptomData)) {
        if (lowerInput.includes(key)) {
          found = { symptom: key, ...data };
          break;
        }
      }

      if (found) {
        setResult(found);
      } else {
        setResult({
          symptom: "Unknown",
          causes: ["Inconclusive based on provided input"],
          advice: "Please consult a healthcare professional for an accurate assessment. Describe your symptoms in more detail.",
          risk: "Unknown"
        });
      }
      setLoading(false);
    }, 800);
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'High': return 'text-red-600 bg-red-50 border-red-100';
      case 'Medium': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'Low': return 'text-green-600 bg-green-50 border-green-100';
      default: return 'text-slate-600 bg-slate-50 border-slate-100';
    }
  };

  return (
    <section id="symptom-checker" className="w-full max-w-4xl mx-auto my-16 p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-primary-100 rounded-2xl text-primary-600">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">AI Symptom Checker</h2>
            <p className="text-slate-500 text-sm">Quick informational assessment of your health concerns</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-slate-700 ml-1">
              What symptoms are you experiencing?
            </label>
            <div className="relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g., I have a persistent headache and feel slightly dizzy..."
                className="w-full h-40 p-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all resize-none bg-slate-50/50"
              />
              <Search className="absolute bottom-4 right-4 w-5 h-5 text-slate-400" />
            </div>
            <button
              onClick={analyzeSymptoms}
              disabled={loading || !input.trim()}
              className="w-full py-4 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-bold transition-all shadow-lg shadow-primary-500/25 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>Analyze Symptoms <ArrowRight className="w-5 h-5" /></>
              )}
            </button>

            <div className="flex items-start gap-2 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <Info className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
              <p className="text-xs text-slate-500 leading-relaxed">
                <span className="font-bold text-slate-700">Safety First:</span> This tool is for informational purposes only and is not a medical diagnosis. Always seek the advice of a qualified health provider.
              </p>
            </div>
          </div>

          <div className="flex flex-col">
            {result ? (
              <div className="flex-1 animate-fade-in space-y-6">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider ${getRiskColor(result.risk)}`}>
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Risk Level: {result.risk}
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <div className="w-1.5 h-6 bg-primary-500 rounded-full"></div>
                    Possible Causes
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {result.causes.map((cause, i) => (
                      <span key={i} className="px-3 py-1.5 bg-white border border-slate-100 rounded-lg text-slate-700 text-sm shadow-sm flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary-500" />
                        {cause}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <div className="w-1.5 h-6 bg-primary-500 rounded-full"></div>
                    Recommended Advice
                  </h3>
                  <div className="p-4 rounded-2xl bg-primary-50 border border-primary-100 text-primary-900 text-sm leading-relaxed">
                    {result.advice}
                  </div>
                </div>

                {result.risk === 'High' && (
                  <div className="p-4 rounded-2xl bg-red-50 border border-red-100 text-red-700 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-sm">Emergency Warning</p>
                      <p className="text-xs mt-1">If you are experiencing severe pain, difficulty breathing, or other life-threatening symptoms, call emergency services immediately.</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 border-2 border-dashed border-slate-100 rounded-[2rem] flex flex-col items-center justify-center p-8 text-center bg-slate-50/30">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                  <Activity className="w-8 h-8 text-slate-200" />
                </div>
                <h3 className="text-slate-400 font-medium">Your analysis will appear here</h3>
                <p className="text-slate-300 text-sm max-w-[200px] mt-2">Enter your symptoms on the left to get a preliminary assessment.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SymptomChecker;
