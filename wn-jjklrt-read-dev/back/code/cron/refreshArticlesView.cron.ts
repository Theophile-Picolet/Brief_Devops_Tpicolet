// config du Cron: rafraîchissement de la vue des articles

import cron from 'node-cron';
import { pool } from '../database/db';

export function scheduleArticlesViewRefresh() {
  cron.schedule('*/10 * * * *', async () => { // Toutes les 10 minutes
    try {
      console.log('[CRON] Refresh de la vue matérialisée...');
      await pool.query(
        'REFRESH MATERIALIZED VIEW reader.articles_lecture;' // Ajustez le nom de la vue selon notre schéma Lecteur
      );
      console.log('[CRON] Refresh terminé avec succès');
    } catch (error) {
      console.error('[CRON] Erreur lors du refresh', error);
    }
  });
}

// Note : Assurez-vous que cette fonction est appelée lors du démarrage de l'application pour activer le Cron.

// ⏱️ Comprendre l'expression Cron (à quoi correspond chaque étoile "*" ) :

// * * * * *
// │ │ │ │ │
// │ │ │ │ └── jour de la semaine
// │ │ │ └──── mois
// │ │ └────── jour du mois
// │ └──────── heure
// └────────── minute

// Exemples d'expressions Cron :
// ⏱️ */5 * * * *    → toutes les 5 minutes
// ⏱️ 0 * * * *      → toutes les heures
// ⏱️ 0 2 * * *      → tous les jours à 2h