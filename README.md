# Bénin en chiffres — Population par département

Projet qui présente la population des 12 départements du Bénin et son évolution entre les recensements de 2002 et de 2013. Il comporte un **tableau de bord web interactif** et une **analyse en Python**.

**Démo en ligne :** https://fideliaeba.github.io/benin-en-chiffres/

![Comparaison 2002 / 2013](images/comparaison_2002_2013.png)

## Tableau de bord web (HTML, CSS, JavaScript)

- Indicateurs clés : population, croissance depuis 2002, département à la croissance la plus rapide
- 5 indicateurs au choix : population 2002, population 2013, habitants gagnés, croissance totale, taux annuel moyen
- Comparaison 2002 / 2013 sur un même graphique
- Tri, filtre Nord / Sud et centre, recherche par département, détail au clic
- Thème clair / sombre

Aucune installation : ouvrir `index.html` dans un navigateur.

## Analyse Python (Pandas, Matplotlib)

```
pip install -r requirements.txt
python analyse_population.py
```

Le script calcule les gains, la croissance et le taux annuel, affiche des statistiques descriptives, écrit `data/population_benin.csv` et enregistre deux graphiques dans `images/`.

## Structure du projet

```
index.html              page du tableau de bord
style.css               mise en forme
script.js               données, calculs et graphiques (Chart.js)
analyse_population.py   analyse et graphiques en Python
data/population_benin.csv
images/
requirements.txt
```

## Données

Source : INSAE / INStaD, recensements RGPH3 (2002, total 6 769 914 habitants) et RGPH4 (2013, total 10 008 749 habitants).
Le taux annuel moyen est calculé sur 11,25 ans et peut différer légèrement des taux publiés par l'INSAE.

## Pistes d'amélioration

- Carte du Bénin colorée par département
- Données par commune
- Projections de population

## Auteure

Fidélia EBA-DOVI, étudiante en Informatique et Télécommunications, INSTI Lokossa.
GitHub : [FideliaEBA](https://github.com/FideliaEBA)
