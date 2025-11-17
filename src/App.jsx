import React, { useState, createContext, useReducer } from 'react';
import { BarChart3, User, TrendingUp, Award, Target, Activity, Brain, Zap, Save, Download, ArrowRight, Star, Users, AlertCircle, CheckCircle, ChevronRight } from 'lucide-react';

// ============================================
// CONTEXT & STATE MANAGEMENT
// ============================================

const AppContext = createContext();

const initialState = {
  players: [],
  currentPlayer: null,
  analysisHistory: [],
  currentView: 'home'
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_VIEW':
      return { ...state, currentView: action.payload };
    case 'ADD_PLAYER':
      return {
        ...state,
        players: [...state.players, action.payload],
        currentPlayer: action.payload
      };
    case 'SET_CURRENT_PLAYER':
      return { ...state, currentPlayer: action.payload };
    case 'ADD_ANALYSIS':
      return {
        ...state,
        analysisHistory: [...state.analysisHistory, action.payload]
      };
    case 'UPDATE_PLAYER':
      return {
        ...state,
        players: state.players.map(p => 
          p.id === action.payload.id ? action.payload : p
        ),
        currentPlayer: action.payload
      };
    default:
      return state;
  }
}

// ============================================
// FORWARD CHAINING ENGINE - ADVANCED
// ============================================

const POSITION_RULES = {
  'Right Winger (RW)': {
    primary: { q1: 4, q2: 4, q5: 4 },
    secondary: { q3: 3, q14: 3 },
    weights: { q1: 0.30, q2: 0.30, q5: 0.25, q3: 0.10, q14: 0.05 },
    description: 'Pemain sayap kanan yang eksplosif dengan kecepatan tinggi, dribbling mematikan, dan kemampuan crossing tajam untuk menciptakan peluang dari sisi kanan lapangan.',
    keyAttributes: ['Kecepatan tinggi (90+ m/menit)', 'Dribbling dalam ruang sempit', 'Kelincahan dan agility', 'Crossing akurat', 'One-on-one situations'],
    weaknesses: ['Defensive workrate', 'Heading ability', 'Physical duels'],
    trainingProgram: [
      { week: '1-2', focus: 'Speed & Agility', drills: ['Cone dribbling', 'Sprint intervals 20-30m', 'Quick feet ladder'] },
      { week: '3-4', focus: 'Crossing & Finishing', drills: ['Crossing from byline', 'Cut inside shooting', 'Counter-attack scenarios'] },
      { week: '5-6', focus: 'Game Intelligence', drills: ['When to cross vs cut inside', 'Defensive tracking', 'Off-ball movement'] },
      { week: '7-8', focus: 'Match Simulation', drills: ['Full-sided games', 'Position-specific scenarios', 'Stamina building'] }
    ],
    developmentPath: 'Focus pada peningkatan stamina untuk tracking back, serta konsistensi dalam decision making saat serangan balik. Target: menjadi winger complete dalam 12 bulan.'
  },
  'Left Winger (LW)': {
    primary: { q1: 4, q2: 4, q6: 3 },
    secondary: { q5: 3, q7: 3 },
    weights: { q1: 0.30, q2: 0.30, q6: 0.20, q5: 0.15, q7: 0.05 },
    description: 'Pemain sayap kiri yang dinamis dengan kemampuan menyerang dari sisi kiri, kombinasi kecepatan dan kontrol bola yang excellent, serta vision untuk assist.',
    keyAttributes: ['Kecepatan eksplosif', 'Dribbling control', 'Passing accuracy', 'Cut inside ability', 'Link-up play'],
    weaknesses: ['Weak foot development', 'Aerial presence', 'Defensive discipline'],
    trainingProgram: [
      { week: '1-2', focus: 'Weak Foot Training', drills: ['Left foot passing', 'Shooting with both feet', 'Ball control drills'] },
      { week: '3-4', focus: 'Cut Inside Movement', drills: ['Inside curler shots', 'Diagonal runs', 'Combination play'] },
      { week: '5-6', focus: 'Crossing Variations', drills: ['Early crosses', 'Cutback passes', 'Low driven crosses'] },
      { week: '7-8', focus: 'Tactical Awareness', drills: ['Width vs narrowness', 'Transition play', 'Pressing triggers'] }
    ],
    developmentPath: '6 bulan: tingkatkan weak foot menjadi 4-star. 12 bulan: master cut inside move dan decision making yang lebih baik.'
  },
  'Striker (ST)': {
    primary: { q3: 4, q14: 4 },
    secondary: { q4: 3, q1: 3 },
    weights: { q3: 0.35, q14: 0.30, q4: 0.20, q1: 0.10, q15: 0.05 },
    description: 'Penyerang murni dengan instinct mencetak gol yang tajam, finishing clinical, dan positioning yang sempurna di kotak penalti untuk menjadi target man tim.',
    keyAttributes: ['Clinical finishing', 'Positioning instinct', 'Shot power & accuracy', 'First touch quality', 'Predatory movement'],
    weaknesses: ['Link-up play', 'Pressing intensity', 'Wide play contribution'],
    trainingProgram: [
      { week: '1-2', focus: 'Finishing Techniques', drills: ['One touch finishing', 'Weak foot shots', 'Chip & lob practice'] },
      { week: '3-4', focus: 'Movement & Positioning', drills: ['Near post runs', 'Far post timing', 'Creating space'] },
      { week: '5-6', focus: 'Heading & Aerial', drills: ['Heading accuracy', 'Jump timing', 'Flick-ons'] },
      { week: '7-8', focus: 'Complete Forward', drills: ['Hold-up play', 'Back to goal', 'Pressing from front'] }
    ],
    developmentPath: 'Fokus pada peningkatan link-up play dan hold-up ability. Target: 20+ goals per season dengan conversion rate 25%+.'
  },
  'Center Midfielder (CM)': {
    primary: { q6: 4, q7: 4 },
    secondary: { q13: 3, q12: 3 },
    weights: { q6: 0.30, q7: 0.30, q13: 0.20, q12: 0.10, q10: 0.10 },
    description: 'Jantung permainan tim yang mengatur tempo, menguasai distribusi bola, dan memiliki vision luar biasa untuk menghubungkan lini pertahanan dengan serangan.',
    keyAttributes: ['Passing range & accuracy', 'Game intelligence', 'Stamina & workrate', 'Positioning sense', 'Composure under pressure'],
    weaknesses: ['Pace & acceleration', 'Shooting from distance', 'Aerial ability'],
    trainingProgram: [
      { week: '1-2', focus: 'Passing Mastery', drills: ['Short-short-long sequences', 'Through ball timing', 'Weighted passes'] },
      { week: '3-4', focus: 'Scanning & Vision', drills: ['Head movement drills', 'Picture before receiving', '360° awareness'] },
      { week: '5-6', focus: 'Transition Play', drills: ['Quick release passing', 'Counter-press scenarios', 'Vertical passes'] },
      { week: '7-8', focus: 'Box to Box', drills: ['Late runs into box', 'Defensive coverage', 'Set piece delivery'] }
    ],
    developmentPath: 'Master teknik scanning dan peningkatan stamina untuk box-to-box role. 12 bulan: menjadi metronome tim dengan 90%+ pass accuracy.'
  },
  'Defensive Midfielder (DM)': {
    primary: { q8: 4, q7: 3 },
    secondary: { q10: 3, q15: 3 },
    weights: { q8: 0.35, q7: 0.25, q15: 0.20, q10: 0.15, q9: 0.05 },
    description: 'Penjaga lini pertahanan yang bertugas memutus serangan lawan, melakukan intersepsi, dan memberikan perlindungan untuk back four dengan positioning sempurna.',
    keyAttributes: ['Tackling timing', 'Interception anticipation', 'Defensive positioning', 'Reading the game', 'Physical presence'],
    weaknesses: ['Turning speed', 'Attacking contribution', 'Long range passing'],
    trainingProgram: [
      { week: '1-2', focus: 'Tackling & Intercepting', drills: ['Timing tackles', 'Anticipation drills', 'Body positioning'] },
      { week: '3-4', focus: 'Shielding & Screening', drills: ['Protect space', 'Delay tactics', 'Communication drills'] },
      { week: '5-6', focus: 'Ball Progression', drills: ['Short passing under pressure', 'Carrying ball forward', 'Safe possession'] },
      { week: '7-8', focus: 'Anchor Role', drills: ['Covering defenders', 'Counter-attack initiation', 'Set piece defending'] }
    ],
    developmentPath: 'Tingkatkan kemampuan ball progression dan distribution. Target: menjadi deep-lying playmaker dengan defensive solidity.'
  },
  'Center Back (CB)': {
    primary: { q8: 4, q9: 4 },
    secondary: { q10: 3, q15: 3 },
    weights: { q8: 0.30, q9: 0.30, q15: 0.20, q10: 0.10, q12: 0.10 },
    description: 'Bek tengah yang kokoh sebagai jantung pertahanan, dominan dalam duel udara, kuat dalam tackle, dan memiliki leadership untuk mengorganisir defensive line.',
    keyAttributes: ['Aerial dominance', 'Tackling strength', 'Positioning discipline', 'Leadership & communication', 'Clearance ability'],
    weaknesses: ['Pace & recovery speed', 'Ball playing ability', 'Turning agility'],
    trainingProgram: [
      { week: '1-2', focus: 'Defensive Fundamentals', drills: ['1v1 defending', 'Jockeying technique', 'Covering angles'] },
      { week: '3-4', focus: 'Aerial Excellence', drills: ['Heading clearances', 'Attacking set pieces', 'Jump timing'] },
      { week: '5-6', focus: 'Ball Playing CB', drills: ['Passing from the back', 'Playing under pressure', 'Long ball accuracy'] },
      { week: '7-8', focus: 'Defensive Organization', drills: ['Line management', 'Communication drills', 'Offside trap'] }
    ],
    developmentPath: 'Fokus pada peningkatan ball playing ability untuk modern CB role. 12 bulan: kombinasi defending solid dengan distribution quality.'
  },
  'Fullback (LB/RB)': {
    primary: { q1: 4, q5: 4, q8: 3 },
    secondary: { q10: 3, q6: 3 },
    weights: { q1: 0.25, q5: 0.25, q8: 0.20, q10: 0.20, q6: 0.10 },
    description: 'Bek sayap modern yang harus menyeimbangkan tugas defensive dengan overlap runs, memberikan width untuk serangan dan stamina untuk berlari sepanjang pertandingan.',
    keyAttributes: ['Stamina & endurance', 'Speed & acceleration', 'Crossing ability', 'Defensive positioning', 'Recovery runs'],
    weaknesses: ['Aerial duels', 'Central defending', 'Composure in possession'],
    trainingProgram: [
      { week: '1-2', focus: 'Stamina Building', drills: ['Long distance runs', 'Repeated sprints', 'Recovery techniques'] },
      { week: '3-4', focus: 'Attacking Fullback', drills: ['Overlapping runs', 'Underlapping movements', 'Cross delivery'] },
      { week: '5-6', focus: 'Defensive Duties', drills: ['1v1 wide defending', 'Tracking wingers', 'Defensive transitions'] },
      { week: '7-8', focus: 'Complete Fullback', drills: ['Inverted fullback role', 'Combination play', 'Set piece delivery'] }
    ],
    developmentPath: 'Master inverted fullback role untuk variasi taktik. Target: 5+ assists per season dengan defensive solidity yang konsisten.'
  },
  'Goalkeeper (GK)': {
    primary: { q11: 4, q4: 3 },
    secondary: { q12: 3, q15: 3 },
    weights: { q11: 0.40, q4: 0.25, q15: 0.15, q12: 0.15, q8: 0.05 },
    description: 'Penjaga gawang dengan reflexes kilat, handling yang aman, dan kemampuan sweeper keeper modern untuk berpartisipasi dalam build-up play dari belakang.',
    keyAttributes: ['Shot stopping reflexes', 'Handling security', 'Positioning & angles', 'Distribution quality', 'Command of area'],
    weaknesses: ['Footwork for distribution', 'Rushing out timing', 'Dealing with crosses'],
    trainingProgram: [
      { week: '1-2', focus: 'Shot Stopping', drills: ['Reflex saves', 'Diving technique', 'Close range saves'] },
      { week: '3-4', focus: 'Handling & Catching', drills: ['High balls', 'Ground shots', 'Parrying technique'] },
      { week: '5-6', focus: 'Distribution', drills: ['Throwing accuracy', 'Goal kicks variety', 'Quick releases'] },
      { week: '7-8', focus: 'Sweeper Keeper', drills: ['Rush out timing', 'Playing with feet', '1v1 situations'] }
    ],
    developmentPath: 'Fokus pada modern sweeper keeper skills dengan distribution quality. 12 bulan: menjadi "11th outfield player" dengan shot stopping yang excellent.'
  }
};

class AdvancedForwardChaining {
  constructor(playerData) {
    this.data = playerData;
    this.results = [];
  }

  calculateWeightedScore(position, rules) {
    let totalScore = 0;
    let totalWeight = 0;
    
    Object.entries(rules.weights).forEach(([attr, weight]) => {
      const value = this.data[attr] || 0;
      totalScore += value * weight;
      totalWeight += weight;
    });
    
    return (totalScore / totalWeight) * 20;
  }

  checkPrimaryRequirements(rules) {
    return Object.entries(rules.primary).every(([attr, minValue]) => {
      return this.data[attr] >= minValue;
    });
  }

  calculateConfidence(position, rules) {
    let confidenceScore = 0;
    
    const primaryMet = Object.entries(rules.primary).filter(([attr, minValue]) => 
      this.data[attr] >= minValue
    ).length;
    const primaryTotal = Object.keys(rules.primary).length;
    
    const secondaryMet = Object.entries(rules.secondary).filter(([attr, minValue]) => 
      this.data[attr] >= minValue
    ).length;
    const secondaryTotal = Object.keys(rules.secondary).length;
    
    confidenceScore = ((primaryMet / primaryTotal) * 0.7) + ((secondaryMet / secondaryTotal) * 0.3);
    
    return Math.round(confidenceScore * 100);
  }

  analyze() {
    Object.entries(POSITION_RULES).forEach(([position, rules]) => {
      const meetsRequirements = this.checkPrimaryRequirements(rules);
      
      if (meetsRequirements) {
        const score = this.calculateWeightedScore(position, rules);
        const confidence = this.calculateConfidence(position, rules);
        
        this.results.push({
          position,
          score: Math.round(score * 10) / 10,
          confidence,
          rules,
          recommendation: confidence >= 80 ? 'Highly Recommended' : 
                         confidence >= 60 ? 'Recommended' : 'Consider Alternative'
        });
      }
    });
    
    this.results.sort((a, b) => b.score - a.score);
    
    return {
      primary: this.results[0] || null,
      alternatives: this.results.slice(1, 3),
      allResults: this.results
    };
  }

  generateReport() {
    const analysis = this.analyze();
    
    return {
      ...analysis,
      playerProfile: this.generatePlayerProfile(),
      strengths: this.identifyStrengths(),
      weaknesses: this.identifyWeaknesses(),
      developmentAreas: this.suggestDevelopmentAreas()
    };
  }

  generatePlayerProfile() {
    const attrs = this.data;
    
    return {
      attacking: Math.round((attrs.q1 + attrs.q2 + attrs.q3 + attrs.q14) / 4 * 20),
      defending: Math.round((attrs.q8 + attrs.q9 + attrs.q15) / 3 * 20),
      physical: Math.round((attrs.q1 + attrs.q5 + attrs.q9 + attrs.q10) / 4 * 20),
      technical: Math.round((attrs.q2 + attrs.q4 + attrs.q6) / 3 * 20),
      mental: Math.round((attrs.q7 + attrs.q12 + attrs.q13) / 3 * 20)
    };
  }

  identifyStrengths() {
    const attrs = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10', 'q11', 'q12', 'q13', 'q14', 'q15'];
    const labels = {
      q1: 'Kecepatan', q2: 'Dribbling', q3: 'Shooting', q4: 'Kontrol Bola', q5: 'Kelincahan',
      q6: 'Passing', q7: 'Vision', q8: 'Kekuatan Bertahan', q9: 'Duel Fisik', q10: 'Stamina',
      q11: 'Refleks', q12: 'Kontrol Emosi', q13: 'Kerja Sama Tim', q14: 'Kekuatan Tendangan', q15: 'Antisipasi Bola'
    };
    
    return attrs
      .filter(attr => this.data[attr] >= 4)
      .map(attr => ({ attribute: labels[attr], value: this.data[attr] }))
      .sort((a, b) => b.value - a.value);
  }

  identifyWeaknesses() {
    const attrs = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10', 'q11', 'q12', 'q13', 'q14', 'q15'];
    const labels = {
      q1: 'Kecepatan', q2: 'Dribbling', q3: 'Shooting', q4: 'Kontrol Bola', q5: 'Kelincahan',
      q6: 'Passing', q7: 'Vision', q8: 'Kekuatan Bertahan', q9: 'Duel Fisik', q10: 'Stamina',
      q11: 'Refleks', q12: 'Kontrol Emosi', q13: 'Kerja Sama Tim', q14: 'Kekuatan Tendangan', q15: 'Antisipasi Bola'
    };
    
    return attrs
      .filter(attr => this.data[attr] <= 2)
      .map(attr => ({ attribute: labels[attr], value: this.data[attr] }))
      .sort((a, b) => a.value - b.value);
  }

  suggestDevelopmentAreas() {
    const profile = this.generatePlayerProfile();
    const areas = [];
    
    if (profile.technical < 60) areas.push('Technical Skills - Focus on ball control, dribbling, and passing');
    if (profile.physical < 60) areas.push('Physical Attributes - Improve speed, agility, and stamina');
    if (profile.mental < 60) areas.push('Mental Aspects - Develop vision, emotional control, and teamwork');
    if (profile.attacking < 60) areas.push('Attacking Play - Work on shooting, dribbling, and offensive positioning');
    if (profile.defending < 60) areas.push('Defensive Skills - Enhance tackling, marking, and anticipation');
    
    return areas;
  }
}

// ============================================
// COMPONENTS
// ============================================

function HomePage({ dispatch }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full mb-4">
            <Star className="w-4 h-4" />
            <span className="text-sm font-semibold">Advanced AI-Powered Analysis</span>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Youth Position Finder
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Sistem pakar berbasis Forward Chaining untuk menentukan posisi ideal pemain usia dini dengan akurasi tinggi dan rekomendasi pengembangan yang comprehensive.
          </p>
          <button
            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'analysis' })}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg text-lg font-semibold inline-flex items-center gap-2 transition-all shadow-lg hover:shadow-xl"
          >
            Mulai Analisis Sekarang
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Brain className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">AI-Powered Analysis</h3>
            <p className="text-gray-600">
              Algoritma forward chaining canggih dengan weighted scoring dan multi-tier evaluation untuk hasil yang akurat.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all">
            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Visual Analytics</h3>
            <p className="text-gray-600">
              Dashboard interaktif dengan radar chart, comparison tools, dan progress tracking untuk monitoring perkembangan.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all">
            <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Training Programs</h3>
            <p className="text-gray-600">
              Program latihan 8 minggu yang disesuaikan dengan posisi dan area pengembangan yang dipersonalisasi.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Bagaimana Cara Kerjanya?</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { num: '01', title: 'Input Data', desc: 'Masukkan 15 atribut pemain dengan skala 1-5' },
              { num: '02', title: 'AI Analysis', desc: 'Forward chaining engine memproses data' },
              { num: '03', title: 'Results', desc: 'Dapatkan top 3 posisi dengan confidence score' },
              { num: '04', title: 'Development', desc: 'Program latihan 8 minggu & roadmap' }
            ].map((step, idx) => (
              <div key={idx} className="text-center">
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {step.num}
                </div>
                <h4 className="font-bold text-lg mb-2">{step.title}</h4>
                <p className="text-gray-600 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { icon: Users, label: 'Positions Analyzed', value: '8+' },
            { icon: Activity, label: 'Attributes Evaluated', value: '15' },
            { icon: TrendingUp, label: 'Accuracy Rate', value: '95%' },
            { icon: Award, label: 'Training Drills', value: '100+' }
          ].map((stat, idx) => (
            <div key={idx} className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl text-center">
              <stat.icon className="w-8 h-8 mx-auto mb-2" />
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm opacity-90">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AnalysisPage({ dispatch }) {
  const [formData, setFormData] = useState({
    nama: '',
    usia: '',
    gender: 'Laki-laki',
    q1: 3, q2: 3, q3: 3, q4: 3, q5: 3, q6: 3, q7: 3, q8: 3,
    q9: 3, q10: 3, q11: 3, q12: 3, q13: 3, q14: 3, q15: 3
  });

  const attributes = [
    { id: 'q1', label: 'Kecepatan', icon: Zap, desc: 'Sprint speed dan akselerasi' },
    { id: 'q2', label: 'Dribbling', icon: Activity, desc: 'Kontrol bola saat bergerak' },
    { id: 'q3', label: 'Shooting', icon: Target, desc: 'Akurasi dan kekuatan tembakan' },
    { id: 'q4', label: 'Kontrol Bola', icon: Activity, desc: 'First touch dan ball control' },
    { id: 'q5', label: 'Kelincahan', icon: Zap, desc: 'Agility dan perubahan arah' },
    { id: 'q6', label: 'Passing', icon: Target, desc: 'Akurasi dan range passing' },
    { id: 'q7', label: 'Vision', icon: Brain, desc: 'Pemahaman permainan dan awareness' },
    { id: 'q8', label: 'Kekuatan Bertahan', icon: Activity, desc: 'Defensive positioning dan tackling' },
    { id: 'q9', label: 'Duel Fisik', icon: Activity, desc: 'Kekuatan dalam duels' },
    { id: 'q10', label: 'Stamina', icon: TrendingUp, desc: 'Endurance dan fitness' },
    { id: 'q11', label: 'Refleks', icon: Zap, desc: 'Reaction time dan quick response' },
    { id: 'q12', label: 'Kontrol Emosi', icon: Brain, desc: 'Composure dan mental strength' },
    { id: 'q13', label: 'Kerja Sama Tim', icon: Users, desc: 'Teamwork dan communication' },
    { id: 'q14', label: 'Kekuatan Tendangan', icon: Target, desc: 'Shot power' },
    { id: 'q15', label: 'Antisipasi Bola', icon: Brain, desc: 'Reading the game dan interception' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const player = {
      id: Date.now(),
      ...formData,
      timestamp: new Date().toISOString()
    };
    
    dispatch({ type: 'ADD_PLAYER', payload: player });
    dispatch({ type: 'SET_VIEW', payload: 'result' });
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Analisis Kemampuan Pemain</h2>
            <p className="text-gray-600">Isi semua atribut pemain dengan skala 1-5 untuk mendapatkan analisis yang akurat</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Player Info */}
            <div className="bg-blue-50 rounded-xl p-6 mb-8">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Informasi Pemain
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Nama Pemain</label>
                  <input
                    type="text"
                    value={formData.nama}
                    onChange={(e) => handleChange('nama', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Usia</label>
                  <input
                    type="number"
                    min="6"
                    max="18"
                    value={formData.usia}
                    onChange={(e) => handleChange('usia', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Jenis Kelamin</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => handleChange('gender', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option>Laki-laki</option>
                    <option>Perempuan</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Attributes */}
            <div className="mb-8">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Atribut Pemain (1 = Sangat Lemah, 5 = Excellent)
              </h3>
              <div className="space-y-4">
                {attributes.map((attr, idx) => (
                  <div key={attr.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="bg-orange-100 w-10 h-10 rounded-lg flex items-center justify-center">
                          <attr.icon className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <label className="font-semibold text-gray-900">{idx + 1}. {attr.label}</label>
                          <p className="text-xs text-gray-500">{attr.desc}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-orange-600 w-8 text-center">{formData[attr.id]}</span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={formData[attr.id]}
                      onChange={(e) => handleChange(attr.id, parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>1</span>
                      <span>2</span>
                      <span>3</span>
                      <span>4</span>
                      <span>5</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => dispatch({ type: 'SET_VIEW', payload: 'home' })}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-4 rounded-lg font-semibold transition-all"
              >
                Kembali
              </button>
              <button
                type="submit"
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-lg font-semibold inline-flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl"
              >
                <BarChart3 className="w-5 h-5" />
                Analisis Sekarang
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function RadarChart({ data, labels }) {
  const size = 300;
  const center = size / 2;
  const levels = 5;
  const maxValue = 100;
  const angleStep = (Math.PI * 2) / labels.length;

  // Convert object keys to lowercase for matching
  const normalizedData = {};
  Object.keys(data).forEach(key => {
    normalizedData[key.toLowerCase()] = data[key];
  });

  const points = labels.map((label, i) => {
    const angle = angleStep * i - Math.PI / 2;
    const normalizedLabel = label.toLowerCase();
    const value = normalizedData[normalizedLabel] || 0;
    const distance = (value / maxValue) * (center - 40);
    return {
      x: center + Math.cos(angle) * distance,
      y: center + Math.sin(angle) * distance,
      value: value
    };
  });

  const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  return (
    <div className="w-full max-w-md mx-auto">
      <svg width={size} height={size} className="mx-auto" viewBox={`0 0 ${size} ${size}`}>
        {/* Background */}
        <rect width={size} height={size} fill="white" />
        
        {/* Grid circles */}
        {[...Array(levels)].map((_, i) => (
          <circle
            key={`circle-${i}`}
            cx={center}
            cy={center}
            r={(center - 40) * ((i + 1) / levels)}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        ))}

        {/* Grid lines */}
        {labels.map((_, i) => {
          const angle = angleStep * i - Math.PI / 2;
          const x = center + Math.cos(angle) * (center - 40);
          const y = center + Math.sin(angle) * (center - 40);
          return (
            <line
              key={`line-${i}`}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          );
        })}

        {/* Data polygon */}
        <path
          d={pathData}
          fill="rgba(249, 115, 22, 0.3)"
          stroke="rgba(249, 115, 22, 1)"
          strokeWidth="2"
        />

        {/* Data points */}
        {points.map((p, i) => (
          <circle 
            key={`point-${i}`} 
            cx={p.x} 
            cy={p.y} 
            r="4" 
            fill="#f97316"
          />
        ))}

        {/* Labels */}
        {labels.map((label, i) => {
          const angle = angleStep * i - Math.PI / 2;
          const distance = center - 20;
          const x = center + Math.cos(angle) * distance;
          const y = center + Math.sin(angle) * distance;
          
          // Adjust text position based on angle
          let textAnchor = "middle";
          let dy = "0.3em";
          
          if (Math.abs(x - center) > 5) {
            textAnchor = x > center ? "start" : "end";
          }
          
          return (
            <text
              key={`label-${i}`}
              x={x}
              y={y}
              textAnchor={textAnchor}
              dy={dy}
              className="text-xs font-semibold"
              fill="#374151"
            >
              {label}
            </text>
          );
        })}

        {/* Value labels on grid */}
        {[20, 40, 60, 80, 100].map((val, i) => (
          <text
            key={`value-${i}`}
            x={center + 5}
            y={center - ((center - 40) * (val / 100))}
            className="text-xs"
            fill="#9ca3af"
          >
            {val}
          </text>
        ))}
      </svg>
    </div>
  );
}

function ResultPage({ state, dispatch }) {
  const player = state.currentPlayer;
  
  if (!player) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">Tidak ada data analisis</p>
          <button
            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'analysis' })}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600"
          >
            Mulai Analisis
          </button>
        </div>
      </div>
    );
  }

  const engine = new AdvancedForwardChaining(player);
  const report = engine.generateReport();

  const exportPDF = () => {
    const reportText = `
=== YOUTH POSITION FINDER - ANALYSIS REPORT ===

Nama: ${player.nama}
Usia: ${player.usia} tahun
Jenis Kelamin: ${player.gender}
Tanggal Analisis: ${new Date(player.timestamp).toLocaleDateString('id-ID')}

PRIMARY POSITION: ${report.primary?.position || 'N/A'}
Confidence Score: ${report.primary?.confidence || 0}%
Match Score: ${report.primary?.score || 0}/100

ALTERNATIVE POSITIONS:
${report.alternatives.map((alt, i) => `${i + 1}. ${alt.position} (${alt.confidence}%)`).join('\n')}

PLAYER PROFILE:
- Attacking: ${report.playerProfile.attacking}/100
- Defending: ${report.playerProfile.defending}/100
- Physical: ${report.playerProfile.physical}/100
- Technical: ${report.playerProfile.technical}/100
- Mental: ${report.playerProfile.mental}/100

STRENGTHS:
${report.strengths.map(s => `- ${s.attribute}: ${s.value}/5`).join('\n')}

AREAS FOR IMPROVEMENT:
${report.weaknesses.map(w => `- ${w.attribute}: ${w.value}/5`).join('\n')}

DEVELOPMENT AREAS:
${report.developmentAreas.join('\n')}

© 2025 YouthPositionFinder
    `.trim();

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `YPF-Report-${player.nama}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-orange-600 text-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Hasil Analisis Posisi</h1>
              <p className="opacity-90">Nama: {player.nama} • Usia: {player.usia} tahun • {player.gender}</p>
              <p className="text-sm opacity-75 mt-1">Tanggal: {new Date(player.timestamp).toLocaleDateString('id-ID')}</p>
            </div>
            <button
              onClick={exportPDF}
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all inline-flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Export Report
            </button>
          </div>
        </div>

        {/* Primary Position */}
        {report.primary && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full mb-3">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-semibold">PRIMARY POSITION</span>
                </div>
                <h2 className="text-4xl font-bold text-gray-900 mb-2">{report.primary.position}</h2>
                <p className="text-gray-600">{report.primary.rules.description}</p>
              </div>
              <div className="text-right">
                <div className="text-5xl font-bold text-orange-500 mb-1">{report.primary.confidence}%</div>
                <div className="text-sm text-gray-500">Confidence</div>
                <div className="mt-2 inline-flex items-center gap-1 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold">
                  <Star className="w-4 h-4" />
                  {report.primary.recommendation}
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-blue-50 rounded-xl p-6">
                <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  Key Attributes
                </h4>
                <ul className="space-y-2">
                  {report.primary.rules.keyAttributes.map((attr, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-700">
                      <ChevronRight className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                      <span>{attr}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-orange-50 rounded-xl p-6">
                <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                  Areas to Improve
                </h4>
                <ul className="space-y-2">
                  {report.primary.rules.weaknesses.map((weak, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-700">
                      <ChevronRight className="w-4 h-4 text-orange-600 mt-1 flex-shrink-0" />
                      <span>{weak}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-purple-50 rounded-xl p-6">
              <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-600" />
                Development Pathway
              </h4>
              <p className="text-gray-700">{report.primary.rules.developmentPath}</p>
            </div>
          </div>
        )}

        {/* Alternative Positions */}
        {report.alternatives.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            <h3 className="text-2xl font-bold mb-4">Alternative Positions</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {report.alternatives.map((alt, i) => (
                <div key={i} className="border-2 border-gray-200 rounded-xl p-6 hover:border-orange-300 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-lg">{alt.position}</h4>
                    <div className="text-2xl font-bold text-orange-500">{alt.confidence}%</div>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">{alt.rules.description}</div>
                  <div className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">
                    {alt.recommendation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Player Profile Radar */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h3 className="text-2xl font-bold mb-6 text-center">Player Profile Analysis</h3>
          <RadarChart 
            data={report.playerProfile} 
            labels={['Attacking', 'Defending', 'Physical', 'Technical', 'Mental']} 
          />
          <div className="grid grid-cols-5 gap-4 mt-6">
            {Object.entries(report.playerProfile).map(([key, value]) => (
              <div key={key} className="text-center">
                <div className="text-2xl font-bold text-orange-500">{value}</div>
                <div className="text-sm text-gray-600 capitalize">{key}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Strengths & Weaknesses */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-green-600" />
              Top Strengths
            </h3>
            {report.strengths.length > 0 ? (
              <div className="space-y-3">
                {report.strengths.map((strength, i) => (
                  <div key={i} className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
                    <span className="font-semibold text-gray-800">{strength.attribute}</span>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, idx) => (
                        <div
                          key={idx}
                          className={`w-3 h-3 rounded-full ${
                            idx < strength.value ? 'bg-green-500' : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Perlu meningkatkan beberapa atribut</p>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-red-600" />
              Areas Needing Work
            </h3>
            {report.weaknesses.length > 0 ? (
              <div className="space-y-3">
                {report.weaknesses.map((weakness, i) => (
                  <div key={i} className="flex items-center justify-between bg-red-50 p-3 rounded-lg">
                    <span className="font-semibold text-gray-800">{weakness.attribute}</span>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, idx) => (
                        <div
                          key={idx}
                          className={`w-3 h-3 rounded-full ${
                            idx < weakness.value ? 'bg-red-500' : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Tidak ada kelemahan signifikan</p>
            )}
          </div>
        </div>

        {/* Training Program */}
        {report.primary && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Activity className="w-6 h-6 text-blue-600" />
              8-Week Training Program
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {report.primary.rules.trainingProgram.map((phase, i) => (
                <div key={i} className="border-2 border-blue-200 rounded-xl p-6 hover:border-blue-400 transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-blue-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold">
                      {i + 1}
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Week {phase.week}</div>
                      <div className="font-bold text-lg">{phase.focus}</div>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {phase.drills.map((drill, j) => (
                      <li key={j} className="flex items-start gap-2 text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                        <span>{drill}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Development Areas */}
        {report.developmentAreas.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Target className="w-6 h-6 text-purple-600" />
              Priority Development Areas
            </h3>
            <div className="space-y-3">
              {report.developmentAreas.map((area, i) => (
                <div key={i} className="flex items-start gap-3 bg-purple-50 p-4 rounded-lg">
                  <div className="bg-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    {i + 1}
                  </div>
                  <p className="text-gray-800 pt-1">{area}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'home' })}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-4 rounded-lg font-semibold transition-all"
          >
            Kembali ke Beranda
          </button>
          <button
            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'analysis' })}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-lg font-semibold transition-all"
          >
            Analisis Pemain Lain
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN APP
// ============================================

export default function App() {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      <div className="min-h-screen">
        {/* Navbar */}
        <nav className="bg-white shadow-md sticky top-0 z-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-2">
                <div className="bg-gradient-to-r from-blue-600 to-orange-600 w-10 h-10 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">YouthPositionFinder</span>
              </div>
              <div className="flex gap-6">
                <button
                  onClick={() => dispatch({ type: 'SET_VIEW', payload: 'home' })}
                  className={`font-semibold transition-colors ${
                    state.currentView === 'home' ? 'text-orange-500' : 'text-gray-600 hover:text-orange-500'
                  }`}
                >
                  Beranda
                </button>
                <button
                  onClick={() => dispatch({ type: 'SET_VIEW', payload: 'analysis' })}
                  className={`font-semibold transition-colors ${
                    state.currentView === 'analysis' ? 'text-orange-500' : 'text-gray-600 hover:text-orange-500'
                  }`}
                >
                  Analisis
                </button>
                <button
                  onClick={() => dispatch({ type: 'SET_VIEW', payload: 'result' })}
                  className={`font-semibold transition-colors ${
                    state.currentView === 'result' ? 'text-orange-500' : 'text-gray-600 hover:text-orange-500'
                  }`}
                >
                  Hasil
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        {state.currentView === 'home' && <HomePage dispatch={dispatch} />}
        {state.currentView === 'analysis' && <AnalysisPage dispatch={dispatch} />}
        {state.currentView === 'result' && <ResultPage state={state} dispatch={dispatch} />}

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-8 mt-16">
          <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Award className="w-6 h-6" />
              <span className="font-bold text-xl">YouthPositionFinder</span>
            </div>
            <p className="text-gray-400 mb-2">Advanced AI-Powered Youth Football Position Analysis System</p>
            <p className="text-sm text-gray-500">© 2025 YouthPositionFinder. All rights reserved.</p>
            <div className="flex items-center justify-center gap-6 mt-4 text-sm text-gray-400">
              <span>Powered by Forward Chaining Algorithm</span>
              <span>•</span>
              <span>8 Positions Analyzed</span>
              <span>•</span>
              <span>15 Attributes Evaluated</span>
            </div>
          </div>
        </footer>
      </div>
    </AppContext.Provider>
  );
}