"""Analyse de la population des départements du Bénin (RGPH3 2002 et RGPH4 2013).

Source : INSAE / INStaD. Le script calcule les évolutions, affiche un résumé
et enregistre des graphiques dans le dossier images/.
Utilisation : python analyse_population.py
"""
from pathlib import Path

import matplotlib.pyplot as plt
import pandas as pd

DONNEES = [
    ("Alibori", 521093, 867463, "Nord"), ("Atacora", 549417, 772262, "Nord"),
    ("Atlantique", 801683, 1398229, "Sud"), ("Borgou", 724171, 1214249, "Nord"),
    ("Collines", 535923, 717477, "Sud"), ("Couffo", 524586, 745328, "Sud"),
    ("Donga", 350062, 543130, "Nord"), ("Littoral", 665100, 679012, "Sud"),
    ("Mono", 360037, 497243, "Sud"), ("Ouémé", 730772, 1100404, "Sud"),
    ("Plateau", 407116, 622372, "Sud"), ("Zou", 599954, 851580, "Sud"),
]
ANNEES = 11.25  # février 2002 -> mai 2013
SORTIE = Path("images")


def construire_tableau() -> pd.DataFrame:
    df = pd.DataFrame(DONNEES, columns=["departement", "pop_2002", "pop_2013", "zone"])
    df["gain"] = df["pop_2013"] - df["pop_2002"]
    df["croissance_pct"] = (df["pop_2013"] / df["pop_2002"] - 1) * 100
    df["taux_annuel_pct"] = ((df["pop_2013"] / df["pop_2002"]) ** (1 / ANNEES) - 1) * 100
    df["part_2013_pct"] = df["pop_2013"] / df["pop_2013"].sum() * 100
    return df.sort_values("pop_2013", ascending=False).reset_index(drop=True)


def graphique_comparaison(df: pd.DataFrame) -> None:
    d = df.sort_values("pop_2013")
    y = range(len(d))
    plt.figure(figsize=(9, 6))
    plt.barh([i - 0.2 for i in y], d["pop_2002"], height=0.4, label="2002", color="#9aa7bd")
    plt.barh([i + 0.2 for i in y], d["pop_2013"], height=0.4, label="2013", color="#2f6fde")
    plt.yticks(list(y), d["departement"])
    plt.xlabel("Habitants")
    plt.title("Population des départements du Bénin : 2002 et 2013")
    plt.legend()
    plt.tight_layout()
    plt.savefig(SORTIE / "comparaison_2002_2013.png", dpi=150)
    plt.close()


def graphique_taux(df: pd.DataFrame) -> None:
    d = df.sort_values("taux_annuel_pct")
    couleurs = ["#e0892b" if z == "Nord" else "#2f6fde" for z in d["zone"]]
    plt.figure(figsize=(9, 6))
    plt.barh(d["departement"], d["taux_annuel_pct"], color=couleurs)
    plt.xlabel("Taux de croissance annuel moyen (%)")
    plt.title("Croissance annuelle 2002-2013 (orange : Nord, bleu : Sud)")
    plt.tight_layout()
    plt.savefig(SORTIE / "taux_croissance.png", dpi=150)
    plt.close()


def main() -> None:
    SORTIE.mkdir(exist_ok=True)
    Path("data").mkdir(exist_ok=True)
    df = construire_tableau()
    df.round(2).to_csv("data/population_benin.csv", index=False, encoding="utf-8")

    print(df.round(2).to_string(index=False))
    total_02, total_13 = df["pop_2002"].sum(), df["pop_2013"].sum()
    print(f"\nTotal 2002 : {total_02:,} | Total 2013 : {total_13:,}".replace(",", " "))
    print("\nStatistiques descriptives (pop_2013) :")
    print(df["pop_2013"].describe().round(0).to_string())
    rapide = df.loc[df["taux_annuel_pct"].idxmax()]
    print(f"\nCroissance la plus rapide : {rapide['departement']} ({rapide['taux_annuel_pct']:.2f} %/an)")
    part_nord = df.loc[df["zone"] == "Nord", "pop_2013"].sum() / total_13 * 100
    print(f"Part du Nord en 2013 : {part_nord:.1f} %")

    graphique_comparaison(df)
    graphique_taux(df)
    print("\nGraphiques enregistrés dans le dossier images/")


if __name__ == "__main__":
    main()
