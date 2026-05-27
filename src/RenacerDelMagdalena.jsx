import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Heart, Zap, BookOpen, Droplet } from 'lucide-react';

export default function RenacerDelMagdalena() {
  // Estado del Jugador
  const [personalMoney, setPersonalMoney] = useState(500);
  const [communityFund, setCommunityFund] = useState(100);
  const [wellbeingIndex, setWellbeingIndex] = useState(20);
  const [day, setDay] = useState(1);
  const [gameLog, setGameLog] = useState([
    '¡Bienvenido, pescador! Tu misión es prosperar y llevar bienestar a tu pueblo.'
  ]);

  // Estado de inversiones
  const [healthFacility, setHealthFacility] = useState(0);
  const [electricityNetwork, setElectricityNetwork] = useState(0);
  const [schoolRepairs, setSchoolRepairs] = useState(0);

  // Estado UI
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [npcDialog, setNpcDialog] = useState(null);
  const [showNPCDialog, setShowNPCDialog] = useState(false);

  // Base de datos de NPCs y sus diálogos
  const npcDialogs = {
    low: [
      {
        name: 'Don Ramón (Pescador Veterano)',
        text: 'Hermano, la pesca ha estado difícil. Recuerdo cuando el río daba más. Tú tienes que seguir adelante.'
      },
      {
        name: 'María (Lider Comunitaria)',
        text: 'Gracias por el esfuerzo, pero nuestros hijos aún no tienen donde estudiar bien. Cada peso cuenta.'
      }
    ],
    medium: [
      {
        name: 'Don Ramón (Pescador Veterano)',
        text: 'Veo que eres un buen hijo del pueblo. Esa clínica que construyeron ya está salvando vidas. Mi nieta fue atendida allá.'
      },
      {
        name: 'Catalina (Maestra)',
        text: 'La escuela está mejorando... pero aún falta mucho. Los niños merecen lo mejor. Sigue así, pescador.'
      }
    ],
    high: [
      {
        name: 'El Chamán de la Ciénaga (Guardián del Saber)',
        text: 'Veo en ti el espíritu de los antiguos. Mompós y Ciénaga respiran de nuevo. La Ciénaga Grande sonríe.'
      },
      {
        name: 'María (Lider Comunitaria)',
        text: '¡Mira! Ahora tenemos luz, agua limpia, una clínica y escuelas. Nuestro pueblo renace. Eres un verdadero héroe.'
      },
      {
        name: 'Don Ramón (Pescador Veterano)',
        text: 'Esto que has hecho... tus hijos vivirán mejor. Eso es la verdadera riqueza, compa.'
      }
    ]
  };

  // Mecánica de Pesca
  const goFishing = () => {
    const catch_amount = Math.floor(Math.random() * (300 - 100 + 1)) + 100;
    const personal_cut = Math.floor(catch_amount * 0.6);
    const community_cut = Math.floor(catch_amount * 0.4);

    setPersonalMoney(prev => prev + personal_cut);
    setCommunityFund(prev => prev + community_cut);

    const fishSpecies = ['Tilapia', 'Bocachico', 'Róbalo'];
    const species = fishSpecies[Math.floor(Math.random() * fishSpecies.length)];

    const newLog = `Día ${day}: Atrapaste ${catch_amount} unidades de ${species}. 💰 +${personal_cut} (personal), 🏘️ +${community_cut} (comunidad)`;
    addGameLog(newLog);

    setDay(prev => prev + 1);
  };

  // Función para agregar logs
  const addGameLog = (message) => {
    setGameLog(prev => [message, ...prev].slice(0, 8));
  };

  // Función para invertir en obras públicas
  const investInProject = (projectName, cost, setterFunction, currentLevel) => {
    if (communityFund >= cost) {
      setCommunityFund(prev => prev - cost);
      setterFunction(currentLevel + 1);

      const newWellbeing = Math.min(100, wellbeingIndex + 15);
      setWellbeingIndex(newWellbeing);

      addGameLog(`🏗️ ¡Obra completada! ${projectName} (Nivel ${currentLevel + 1}). Bienestar +15`);

      // Mostrar diálogo del NPC
      triggerNPCDialog(newWellbeing);
    } else {
      addGameLog(`❌ No tienes suficientes fondos. Necesitas ${cost}, tienes ${communityFund}`);
    }
  };

  // Disparar diálogo del NPC según el nivel de bienestar
  const triggerNPCDialog = (wellbeing) => {
    let dialogLevel;
    if (wellbeing < 35) dialogLevel = 'low';
    else if (wellbeing < 70) dialogLevel = 'medium';
    else dialogLevel = 'high';

    const dialogs = npcDialogs[dialogLevel];
    const selectedDialog = dialogs[Math.floor(Math.random() * dialogs.length)];

    setNpcDialog(selectedDialog);
    setShowNPCDialog(true);

    setTimeout(() => setShowNPCDialog(false), 5000);
  };

  // Renderizar barra de progreso
  const ProgressBar = ({ value, max = 100, color = 'bg-blue-500' }) => (
    <div className="w-full bg-gray-300 rounded-full h-3 overflow-hidden">
      <div
        className={`${color} h-full transition-all duration-500`}
        style={{ width: `${(value / max) * 100}%` }}
      />
    </div>
  );

  // Renderizar tarjeta de inversión
  const ProjectCard = ({ icon: Icon, title, description, cost, level, onInvest }) => (
    <div className="bg-white rounded-lg border-2 border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-gray-800">{title}</h3>
        </div>
        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-semibold">
          Nivel {level}
        </span>
      </div>
      <p className="text-sm text-gray-600 mb-3">{description}</p>
      <div className="mb-3">
        <ProgressBar value={level} max={3} color="bg-green-500" />
        <p className="text-xs text-gray-500 mt-1">{level}/3</p>
      </div>
      <button
        onClick={onInvest}
        disabled={communityFund < cost}
        className={`w-full py-2 rounded font-semibold text-sm transition-all ${
          communityFund >= cost
            ? 'bg-green-500 text-white hover:bg-green-600 cursor-pointer'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        Invertir {cost} 🏘️
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-300 via-blue-100 to-emerald-100 p-4 font-sans">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <header className="mb-6">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600 mb-1">
            🌊 Renacer del Magdalena
          </h1>
          <p className="text-gray-700 text-sm">
            Un viaje de pesca, economía y transformación comunitaria en Ciénaga, Magdalena
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {/* Tarjeta de Dinero Personal */}
          <div className="bg-gradient-to-br from-amber-400 to-orange-400 rounded-lg p-4 text-white shadow-lg">
            <p className="text-sm opacity-90">💰 Tu Dinero (Equipo)</p>
            <p className="text-3xl font-bold">{personalMoney}</p>
            <p className="text-xs opacity-75 mt-1">Para mejorar tu equipo de pesca</p>
          </div>

          {/* Tarjeta de Fondo Comunitario */}
          <div className="bg-gradient-to-br from-emerald-400 to-teal-400 rounded-lg p-4 text-white shadow-lg">
            <p className="text-sm opacity-90">🏘️ Fondo Comunitario</p>
            <p className="text-3xl font-bold">{communityFund}</p>
            <p className="text-xs opacity-75 mt-1">Para obras públicas</p>
          </div>

          {/* Tarjeta de Bienestar */}
          <div className="bg-gradient-to-br from-rose-400 to-pink-400 rounded-lg p-4 text-white shadow-lg">
            <p className="text-sm opacity-90">❤️ Bienestar del Pueblo</p>
            <p className="text-3xl font-bold">{wellbeingIndex}%</p>
            <ProgressBar value={wellbeingIndex} max={100} color="bg-white" />
          </div>
        </div>

        {/* Botón Principal de Pesca */}
        <div className="mb-6">
          <button
            onClick={goFishing}
            className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-bold py-4 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-all text-lg mb-2"
          >
            🎣 Ir a Pescar (Día {day})
          </button>
          <p className="text-xs text-gray-600 text-center">
            Obtienes dinero aleatorio. 60% para ti, 40% al Fondo Comunitario
          </p>
        </div>

        {/* Diálogo del NPC */}
        {showNPCDialog && npcDialog && (
          <div className="mb-6 bg-amber-50 border-l-4 border-amber-500 rounded-lg p-4 shadow-md animate-pulse">
            <p className="font-bold text-amber-900 mb-1">💬 {npcDialog.name}</p>
            <p className="text-amber-800 text-sm italic">"{npcDialog.text}"</p>
          </div>
        )}

        {/* Panel de Inversiones */}
        <div className="mb-6">
          <button
            onClick={() => setIsPanelOpen(!isPanelOpen)}
            className="w-full flex items-center justify-between bg-gray-800 text-white p-4 rounded-lg font-bold hover:bg-gray-900 transition-all"
          >
            <span>🏗️ Panel de Inversiones Comunitarias</span>
            {isPanelOpen ? <ChevronUp /> : <ChevronDown />}
          </button>

          {isPanelOpen && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <ProjectCard
                icon={Heart}
                title="Puesto de Salud"
                description="Dotación médica y personal capacitado para atender a la comunidad"
                cost={250}
                level={healthFacility}
                onInvest={() => investInProject('Puesto de Salud', 250, setHealthFacility, healthFacility)}
              />
              <ProjectCard
                icon={Zap}
                title="Red Eléctrica"
                description="Estabilización y mejora de la red eléctrica local"
                cost={200}
                level={electricityNetwork}
                onInvest={() => investInProject('Red Eléctrica', 200, setElectricityNetwork, electricityNetwork)}
              />
              <ProjectCard
                icon={BookOpen}
                title="Reparación Escolar"
                description="Reparación y dotación de las escuelas rurales de la región"
                cost={180}
                level={schoolRepairs}
                onInvest={() => investInProject('Escuela', 180, setSchoolRepairs, schoolRepairs)}
              />
            </div>
          )}
        </div>

        {/* Resumen de Impacto */}
        <div className="bg-white rounded-lg border-2 border-gray-300 p-4 mb-6">
          <h2 className="font-bold text-gray-800 mb-3">📊 Impacto Generado</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl">❤️</p>
              <p className="text-xs text-gray-600">Puestos de Salud</p>
              <p className="font-bold text-lg text-blue-600">{healthFacility}/3</p>
            </div>
            <div className="text-center">
              <p className="text-2xl">⚡</p>
              <p className="text-xs text-gray-600">Redes Eléctricas</p>
              <p className="font-bold text-lg text-yellow-600">{electricityNetwork}/3</p>
            </div>
            <div className="text-center">
              <p className="text-2xl">📚</p>
              <p className="text-xs text-gray-600">Escuelas Reparadas</p>
              <p className="font-bold text-lg text-green-600">{schoolRepairs}/3</p>
            </div>
          </div>
        </div>

        {/* Log del Juego */}
        <div className="bg-gray-900 rounded-lg p-4 text-white font-mono text-sm max-h-48 overflow-y-auto border-2 border-gray-700">
          <h2 className="font-bold mb-3 text-gray-300">📜 Registro del Pueblo</h2>
          {gameLog.map((log, idx) => (
            <p key={idx} className="text-gray-300 mb-2 leading-relaxed">
              {log}
            </p>
          ))}
        </div>

        {/* Footer Narrativo */}
        <div className="mt-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4 border border-gray-300">
          <p className="text-gray-700 text-sm leading-relaxed">
            <strong>📖 La Visión:</strong> En Ciénaga, el río Magdalena no solo alimenta. Es el corazón de una comunidad que
            ha resistido y perseverado. Como pescador, tú tienes el poder de transformar esa resistencia en prosperidad compartida.
            Cada peso que ganas es una oportunidad para llevar salud, educación y luz a tu pueblo. El bienestar no es individual,
            es colectivo. 🌊💚
          </p>
        </div>
      </div>
    </div>
  );
}
