import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Leaf, Utensils, Target, DollarSign, Globe, Calculator, ArrowRight, CheckCircle, Info } from 'lucide-react';

const API_BASE = "http://localhost:5000";

const App = () => {
  // Calorie Predictor State
  const [calorieInputs, setCalorieInputs] = useState({
    age: 25,
    weight: 70,
    height: 1.75,
    activity: 1.2
  });
  const [prediction, setPrediction] = useState(null);

  // Plan Generator State
  const [planInputs, setPlanInputs] = useState({
    goal: 'weight loss',
    budget: 'low',
    culture: 'Indian'
  });
  const [planResult, setPlanResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/api/predict`, calorieInputs);
      setPrediction(res.data.daily_calories);
    } catch (err) {
      console.error("Prediction error", err);
    }
  };

  const handleGeneratePlan = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/api/generate-plan`, {
        goal: planInputs.goal,
        budget: planInputs.budget,
        cultural_habits: planInputs.culture
      });
      if (res.data.status === "success") {
        setPlanResult(res.data.data);
      }
    } catch (err) {
      console.error("Plan generation error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 space-y-12">
      {/* Hero Section */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-4xl mx-auto space-y-4"
      >
        <h1 className="text-5xl md:text-7xl font-extrabold gradient-text leading-tight">
          AI Fitness Forge
        </h1>
        <p className="text-slate-400 text-lg md:text-xl">
          Data-driven precision. Personalized for your life, your culture, and your goals.
        </p>
      </motion.header>

      <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">

        {/* Section 1: Calorie Command Center */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass rounded-3xl p-8 space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-violet-600/20 text-violet-400">
              <Calculator size={28} />
            </div>
            <h2 className="text-2xl font-bold">Calorie Command</h2>
          </div>

          <form onSubmit={handlePredict} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Age"
                type="number"
                value={calorieInputs.age}
                onChange={(v) => setCalorieInputs({ ...calorieInputs, age: v })}
              />
              <InputField
                label="Weight (kg)"
                type="number"
                value={calorieInputs.weight}
                onChange={(v) => setCalorieInputs({ ...calorieInputs, weight: v })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Height (m)"
                type="number"
                step="0.01"
                value={calorieInputs.height}
                onChange={(v) => setCalorieInputs({ ...calorieInputs, height: v })}
              />
              <InputField
                label="Activity (1-2)"
                type="number"
                step="0.1"
                value={calorieInputs.activity}
                onChange={(v) => setCalorieInputs({ ...calorieInputs, activity: v })}
              />
            </div>
            <button className="w-full py-4 rounded-2xl bg-violet-600 hover:bg-violet-500 font-bold transition-all shadow-lg glow">
              Predict Daily Calories
            </button>
          </form>

          <AnimatePresence>
            {prediction && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 rounded-2xl bg-violet-900/30 border border-violet-500/30 text-center"
              >
                <p className="text-violet-300 text-sm uppercase tracking-widest font-semibold">Recommended Intake</p>
                <h3 className="text-4xl font-black text-white mt-1">{prediction} Kcal</h3>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Section 2: Plan Architect */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass rounded-3xl p-8 space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-pink-600/20 text-pink-400">
              <Target size={28} />
            </div>
            <h2 className="text-2xl font-bold">Plan Architect</h2>
          </div>

          <div className="space-y-4">
            <SelectField
              label="Target Goal"
              icon={<Activity size={18} />}
              options={['weight loss', 'weight gain', 'muscle building']}
              value={planInputs.goal}
              onChange={(v) => setPlanInputs({ ...planInputs, goal: v })}
            />
            <SelectField
              label="Budget Level"
              icon={<DollarSign size={18} />}
              options={['low', 'medium', 'high']}
              value={planInputs.budget}
              onChange={(v) => setPlanInputs({ ...planInputs, budget: v })}
            />
            <SelectField
              label="Cultural Preference"
              icon={<Globe size={18} />}
              options={['Indian', 'Global']}
              value={planInputs.culture}
              onChange={(v) => setPlanInputs({ ...planInputs, culture: v })}
            />
            <button
              onClick={handleGeneratePlan}
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-pink-600 hover:bg-pink-500 font-bold transition-all shadow-lg disabled:opacity-50"
            >
              {loading ? "Forging Plan..." : "Generate Personalized Plan"}
            </button>
          </div>
        </motion.div>
      </div>

      {/* Results Section */}
      <AnimatePresence>
        {planResult && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="max-w-7xl mx-auto space-y-8"
          >
            <div className="text-center">
              <h2 className="text-3xl font-bold">Your Forged Blueprint</h2>
              <p className="text-slate-400 mt-2">{planResult.advice}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <ResultCard
                title="Workout Routine"
                icon={<Activity className="text-blue-400" />}
                content={planResult.workout_plan}
              />
              <ResultCard
                title="Dietary Focus"
                icon={<Utensils className="text-green-400" />}
                content={planResult.diet_plan}
              />
              <div className="glass rounded-3xl p-6 space-y-4">
                <div className="flex items-center gap-2 font-bold text-lg mb-2">
                  <Leaf className="text-emerald-400" />
                  <span>Core Strategy</span>
                </div>
                <ul className="space-y-3">
                  {planResult.tips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-slate-300 text-sm">
                      <CheckCircle size={14} className="text-emerald-500 mt-1 flex-shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="text-center text-slate-500 text-sm py-8 border-t border-slate-800">
        AI Fitness Forge &copy; 2026 | Data-Driven Decisions
      </footer>
    </div>
  );
};

const InputField = ({ label, type, value, onChange, step }) => (
  <div className="space-y-1.5 text-left">
    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</label>
    <input
      type={type}
      step={step}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 outline-none focus:border-violet-500/50 transition-colors"
    />
  </div>
);

const SelectField = ({ label, options, value, onChange, icon }) => (
  <div className="space-y-1.5 text-left">
    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
      {icon} {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 outline-none focus:border-pink-500/50 transition-colors appearance-none cursor-pointer capitalize"
    >
      {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </div>
);

const ResultCard = ({ title, content, icon }) => (
  <div className="glass rounded-3xl p-6 space-y-4">
    <div className="flex items-center gap-2 font-bold text-lg">
      {icon}
      <span>{title}</span>
    </div>
    <p className="text-slate-300 leading-relaxed text-sm">
      {content}
    </p>
  </div>
);

export default App;
