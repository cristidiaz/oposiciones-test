"use client";

import {
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";

type HomeDashboardProps = {
  preguntas: any[];
  aciertos: number;
  fallos: number;
};

export default function HomeDashboard({
  preguntas,
  aciertos,
  fallos,
}: HomeDashboardProps) {

  const datosGrafico = [
    { value: 20 },
    { value: 35 },
    { value: 28 },
    { value: 45 },
    { value: 42 },
    { value: 60 },
    { value: 55 },
    { value: 72 },
  ];

  const ratio =
    aciertos + fallos > 0
      ? Math.round(
          (aciertos / (aciertos + fallos)) * 100
        )
      : 0;

  return (
    <div className="w-full">

      {/* BIENVENIDA */}

      <div className="mb-10">

        <p className="text-zinc-500 dark:text-zinc-400 font-medium mb-2">
          Plataforma de estudio
        </p>

        <h2 className="text-3xl font-black">
          Bienvenida 👋
        </h2>

      </div>


      {/* TÍTULO */}

      <div className="mb-12">

        <h1 className="text-7xl md:text-8xl font-black leading-none mb-6 bg-gradient-to-r from-black to-zinc-500 dark:from-white dark:to-zinc-500 bg-clip-text text-transparent">

          Oposiciones
          <br />
          Justicia

        </h1>

        <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">

          Practica test oficiales, simulacros y seguimiento de progreso
          en una plataforma moderna diseñada para opositores.

        </p>

      </div>


      {/* ACCIONES PRINCIPALES */}

      <div className="grid md:grid-cols-3 gap-6 mb-12">

        <div className="rounded-[32px] bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/50 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.12)]">

          <div className="text-6xl mb-6">
            🗄️
          </div>

          <h2 className="text-3xl font-black mb-3">
            Base de datos
          </h2>

          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Gestiona preguntas, edita contenido y administra bloques.
          </p>

        </div>


        <div className="rounded-[32px] bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/50 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.12)]">

          <div className="text-6xl mb-6">
            ❌
          </div>

          <h2 className="text-3xl font-black mb-3">
            Fallos
          </h2>

          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Practica únicamente las preguntas falladas para reforzar memoria.
          </p>

        </div>


        <div className="rounded-[32px] bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/50 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.12)]">

          <div className="text-6xl mb-6">
            📊
          </div>

          <h2 className="text-3xl font-black mb-3">
            Estadísticas
          </h2>

          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Consulta tu progreso, resultados y evolución en tests y supuestos.
          </p>

        </div>

      </div>


      {/* ESTADÍSTICAS */}

      <div className="grid md:grid-cols-3 gap-6 mb-12">

        <div className="rounded-[28px] bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/50 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.12)]">

          <p className="text-zinc-500 dark:text-zinc-400 font-bold mb-3">
            📚 Preguntas
          </p>

          <h3 className="text-5xl font-black">
            {preguntas.length}
          </h3>

        </div>


        <div className="rounded-[28px] bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/50 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.12)]">

          <p className="text-zinc-500 dark:text-zinc-400 font-bold mb-3">
            🔥 Ratio
          </p>

          <h3 className="text-5xl font-black">
            {ratio}%
          </h3>

        </div>


        <div className="rounded-[28px] bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/50 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.12)]">

          <p className="text-zinc-500 dark:text-zinc-400 font-bold mb-3">
            ⚡ Tests
          </p>

          <h3 className="text-5xl font-black">
            {aciertos + fallos}
          </h3>

        </div>

      </div>


      {/* EVOLUCIÓN */}

      <div className="rounded-[32px] bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/50 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.12)]">

        <div className="flex items-center justify-between mb-8">

          <div>

            <p className="text-zinc-500 dark:text-zinc-400 font-bold mb-2">
              Rendimiento
            </p>

            <h2 className="text-4xl font-black">
              Evolución semanal
            </h2>

          </div>

          <div className="rounded-2xl bg-green-500/10 border border-green-500/20 px-5 py-3">

            <p className="font-bold text-green-600">
              ↗ +12%
            </p>

          </div>

        </div>


        <div className="h-[260px] w-full min-w-0">

          <ResponsiveContainer width="99%" height={260}>

            <LineChart data={datosGrafico}>

              <Line
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                strokeWidth={5}
                dot={false}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

      </div>

    </div>
  );
}