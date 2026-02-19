import BackButton from "@/app/component/ui/BackButton";

export default function AProposPage() {
  const membres = [
    {
      nom: "Abdel",
      role: "Développeur",
      travailCetteSemaine: "... à compléter",
      travailProchaineSeance: "... à compléter",
    },
    {
      nom: "Julie",
      role: "Développeuse",
      travailCetteSemaine: "Mis en place de la base de données coté lecteur.",
      travailProchaineSeance: "... à compléter",
    },
    {
      nom: "Jean",
      role: "Développeur",
      travailCetteSemaine: "Mis en place du backend  coté lecteur.",
      travailProchaineSeance: "... à compléter",
    },
    {
      nom: "Khady",
      role: "Développeuse",
      travailCetteSemaine: "Intégration frontend coté lecteur",
      travailProchaineSeance: "... à compléter",
    },
    {
      nom: "Luigi",
      role: "Développeur",
      travailCetteSemaine: "... à compléter",
      travailProchaineSeance: "... à compléter",
    },
    {
      nom: "Théophile",
      role: "Développeur",
      travailCetteSemaine: "... à compléter",
      travailProchaineSeance: "... à compléter",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50/30 p-4 sm:p-6 md:p-8">
      <div className="container mx-auto max-w-5xl px-4">
        <BackButton className="mb-6 sm:mb-8" />
        <div className="text-center mb-10 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#253337] mb-3 font-share">
            À propos
          </h1>
          <div className="w-20 h-1 bg-[#C2E0E3] mx-auto rounded-full"></div>
        </div>
        <section className="mb-12 sm:mb-16">
          <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6 sm:p-8 md:p-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#253337] mb-6 font-share">
              World News
            </h2>
            <div className="space-y-4">
              <p className="text-base sm:text-lg text-black leading-relaxed font-puritan">
                World News est une plateforme moderne dédiée à la diffusion
                d'articles et d'informations. Notre mission est de fournir un
                accès facile et intuitif à une sélection d'articles
                soigneusement choisis, permettant à nos lecteurs de rester
                informés sur les actualités qui comptent.
              </p>
              <p className="text-base sm:text-lg text-black leading-relaxed font-puritan">
                World News offre une expérience de lecture fluide et agréable.
                Notre interface responsive s'adapte à tous les appareils, que
                vous consultiez le site depuis votre ordinateur, votre tablette
                ou votre smartphone.
              </p>
            </div>
          </div>
        </section>
        <section>
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#253337] mb-4 font-share">
              Notre Équipe
            </h2>
            <p className="text-base sm:text-lg text-black leading-relaxed max-w-2xl mx-auto font-puritan">
              World News est le fruit du travail collaboratif d'une équipe de 6
              membres passionnés, chacun apportant son expertise pour créer une
              plateforme d'information moderne et efficace.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {membres.map((membre, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-blue-100 overflow-hidden"
              >
                <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 p-4 border-b border-blue-200">
                  <h3 className="text-lg sm:text-xl font-bold text-[#253337] mb-1 font-share">
                    {membre.nom}
                  </h3>
                  <p className="text-sm text-[#5C6C73] font-semibold font-puritan">
                    {membre.role}
                  </p>
                </div>
                <div className="p-4 space-y-3">
                  <div className="bg-blue-50/50 rounded-lg p-3 border-l-4 border-[#C2E0E3]">
                    <h4 className="text-xs font-semibold text-black mb-1.5 font-puritan uppercase tracking-wide">
                      Cette semaine
                    </h4>
                    <p className="text-xs text-black leading-relaxed font-puritan">
                      {membre.travailCetteSemaine}
                    </p>
                  </div>
                  <div className="bg-blue-50/50 rounded-lg p-3 border-l-4 border-[#5C6C73]">
                    <h4 className="text-xs font-semibold text-black mb-1.5 font-puritan uppercase tracking-wide">
                      Prochaine séance
                    </h4>
                    <p className="text-xs text-black leading-relaxed font-puritan">
                      {membre.travailProchaineSeance}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
