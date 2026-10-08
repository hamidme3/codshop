# -*- coding: utf-8 -*-
"""
Full 1-to-1 Page-by-Page Generator for First Year Baccalaureate Sciences (1BAC - 18 Pages)
Author: Professor AYOUB KHAMMOUR (SOM: 1503811)
"""

import os
import subprocess
from exhaustive_curriculum_builder import CSS_PAGE_STYLE, render_official_header, render_official_footer

def build_1bac_html(lang="en"):
    pages_html = []

    # ---------------- PAGE 1: COVER ----------------
    level_title = "1st Year Baccalaureate - Sciences" if lang == "en" else "Première Année du Baccalauréat - Sciences"
    author_role = "Prepared by: Professor AYOUB KHAMMOUR" if lang == "en" else "Conception et Réalisation : Professeur AYOUB KHAMMOUR"
    doc_title = "Pedagogical Lesson Plans" if lang == "en" else "Fiches Pédagogiques"
    sub_title = "Physics & Chemistry" if lang == "en" else "Physique et Chimie"
    meta_ref = "Approved Textbooks – Pedagogical Orientations – Ministerial Notes 09-142 & 144" if lang == "en" else "Cadre de Référence Officiel : Manuels Agréés – Orientations Pédagogiques – Notes Ministérielles N° 09-142 et 144"
    
    p1 = f"""
    <div class="cover-page">
        <div class="cover-badge">Royaume du Maroc • Enseignement Secondaire Qualifiant</div>
        <div class="cover-title">{doc_title}</div>
        <div class="cover-subtitle">{sub_title} ({level_title})</div>
        <div style="font-size: 11pt; color: #475569; max-width: 500px; margin: 0 auto 20px auto;">
            {"Experimental Sciences & Mathematical Sciences (A & B)" if lang=="en" else "Filières des Sciences Expérimentales & Sciences Mathématiques (A et B)"}
        </div>
        <div class="cover-author">
            <strong>{author_role}</strong><br>
            <span style="font-size: 10pt; color: #64748b;">Registration No / N° SOM : 1503811</span>
        </div>
        <div class="cover-meta">{meta_ref}</div>
    </div>
    """
    pages_html.append(p1)

    # ---------------- PAGE 2: MECHANICS UNIT 1 ----------------
    p2 = f"""
    <div class="page">
        <div>
            {render_official_header("1BAC Sciences", "Physics Component" if lang=="en" else "Composante Physique", 1, lang)}
            <div class="overview-box">
                <div class="overview-title">{"Part 1: Mechanical Work and Energy (34 - 45 Hours)" if lang=="en" else "Partie 1 : Le Travail Mécanique et l'Énergie (34 - 45 Heures)"}</div>
                <div class="overview-grid">
                    <div>
                        <strong>{"Targeted Specific Competencies:" if lang=="en" else "Compétences Visées :"}</strong>
                        {"Solve problems relating to energy conservation and dissipation. Build mechanical setups with safety precautions. Use curve-plotting spreadsheet software and simulation tools. Connect observations to physical principles." if lang=="en" else "Résoudre des situations-problèmes relatives à la conservation et dissipation d'énergie. Réaliser des montages mécaniques en toute sécurité. Utiliser les tableurs et logiciels de simulation. Relier les observations quotidiennes aux théories physiques."}
                    </div>
                    <div>
                        <strong>{"Part Units Breakdown:" if lang=="en" else "Unités de la Partie :"}</strong>
                        1. {"Rotation around Fixed Axis (7h)" if lang=="en" else "Rotation autour d'un axe fixe (7h)"} • 
                        2. {"Work and Power of a Force (6h)" if lang=="en" else "Travail et puissance d'une force (6h)"} • 
                        3. {"Work and Kinetic Energy (4-5h)" if lang=="en" else "Travail et énergie cinétique (4-5h)"} • 
                        4. {"Work and Gravitational Potential Energy (5-6h)" if lang=="en" else "Travail et énergie potentielle de pesanteur (5-6h)"} • 
                        5. {"Mechanical Energy of a Solid (5-7h)" if lang=="en" else "Énergie mécanique d'un solide (5-7h)"} • 
                        6. {"Work and Internal Energy (6h)" if lang=="en" else "Travail et énergie interne (6h)"} • 
                        7. {"Thermal Energy: Heat Transfer (8h)" if lang=="en" else "Énergie thermique : transfert thermique (8h)"}
                    </div>
                </div>
            </div>

            <!-- UNIT 1 -->
            <div class="unit-block">
                <div class="unit-banner">
                    <span>{"Unit 1: Rotational Motion of a Rigid Solid Around a Fixed Axis" if lang=="en" else "Unité 1 : Mouvement de Rotation d'un Corps Solide Indéformable Autour d'un Axe Fixe"}</span>
                    <span>7 {"Hours" if lang=="en" else "Heures"}</span>
                </div>
                <div class="unit-prereq-problem">
                    <div class="prereq-col">
                        <div class="block-title">{"Prerequisites:" if lang=="en" else "Prérequis :"}</div>
                        {"Motion relativity, average/instantaneous speed, trajectory, moment of a force." if lang=="en" else "Relativité du mouvement, vitesse moyenne et instantanée, trajectoire, moment d'une force."}
                    </div>
                    <div class="problem-col">
                        <div class="block-title">{"Problem Situation:" if lang=="en" else "Situation-Problème :"}</div>
                        {"Doors and bicycle wheels rotate around fixed axles. How is rotation around a fixed axis characterized, and what links angular speed to linear speed?" if lang=="en" else "Une porte qui s'ouvre ou une roue de bicyclette effectuent une rotation autour d'un axe fixe. Comment caractériser ce mouvement et quelle relation relie vitesse angulaire et linéaire ?"}
                    </div>
                </div>
                <table class="pedagogical-table">
                    <thead><tr><th style="width:25%;">{"Objectives" if lang=="en" else "Objectifs"}</th><th style="width:25%;">{"Contents" if lang=="en" else "Contenus"}</th><th style="width:25%;">{"Didactic Materials" if lang=="en" else "Matériel Didactique"}</th><th style="width:25%;">{"Activities & Evaluation" if lang=="en" else "Activités & Évaluation"}</th></tr></thead>
                    <tbody>
                        <tr>
                            <td>
                                <ul>
                                    <li>{"Define rotational motion around a fixed axis." if lang=="en" else "Définir la rotation autour d'un axe fixe."}</li>
                                    <li>{"Define angular position θ(t) and curvilinear abscissa s(t) = R·θ." if lang=="en" else "Abscisse angulaire θ(t) et curviligne s(t) = R·θ."}</li>
                                    <li>{"Average and instantaneous angular velocity ω = dθ/dt (rad/s)." if lang=="en" else "Vitesse angulaire moyenne et instantanée ω (rad/s)."}</li>
                                    <li>{"Relation between linear speed and angular velocity: v = R · ω." if lang=="en" else "Relation fondamentale : v = R · ω."}</li>
                                    <li>{"Uniform circular rotation: period T = 2π/ω, frequency f = 1/T." if lang=="en" else "Rotation uniforme : période T = 2π/ω, fréquence f = 1/T."}</li>
                                    <li>{"Time equation of uniform rotation: θ(t) = ω·t + θ₀." if lang=="en" else "Équation horaire : θ(t) = ω·t + θ₀."}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>I. {"Position of Point on Rotating Body" if lang=="en" else "Repérage d'un Point"}</strong> (1. {"Fixed axis rotation" if lang=="en" else "Axe fixe"}, 2. {"Angular & curvilinear position" if lang=="en" else "Abscisses angulaire et curviligne"})<br>
                                <strong>II. {"Angular Velocity" if lang=="en" else "Vitesse Angulaire"}</strong> (1. {"Average angular speed" if lang=="en" else "Vitesse moyenne"}, 2. {"Instantaneous angular speed" if lang=="en" else "Vitesse instantanée"}, 3. {"Relation v = R·ω" if lang=="en" else "Relation v = R·ω"})<br>
                                <strong>III. {"Uniform Rotational Motion" if lang=="en" else "Rotation Uniforme"}</strong> (1. {"Definition" if lang=="en" else "Définition"}, 2. {"Period & frequency" if lang=="en" else "Période et fréquence"}, 3. {"Time equation θ(t)" if lang=="en" else "Équation horaire θ(t)"})
                            </td>
                            <td>
                                <ul>
                                    <li>{"Air cushion table with rotating disc accessory" if lang=="en" else "Table à coussin d'air et disque de rotation"}</li>
                                    <li>{"Spark timer, non-elastic thread, pulleys" if lang=="en" else "Éclateur, fil inextensible, poulies"}</li>
                                    <li>{"Metric circular board, chronometer, Avimeca software" if lang=="en" else "Disque gradué, chronomètre, logiciel Avimeca"}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>{"Activities:" if lang=="en" else "Activités :"}</strong> {"Record trajectory of points at various radii; verify that v/R = ω is constant for all points. Write the time equation." if lang=="en" else "Enregistrement de points à différents rayons ; vérification de v/R = ω constant ; établissement de l'équation horaire."}<br>
                                <strong>{"Evaluation:" if lang=="en" else "Évaluation :"}</strong> {"Angular velocity calculations, time equation exercises, Exam 1." if lang=="en" else "Calculs de vitesse angulaire, équations horaires et Devoir 1."}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        {render_official_footer(1, lang)}
    </div>
    """
    pages_html.append(p2)

    # ---------------- PAGE 3: MECHANICS UNITS 2 & 3 ----------------
    p3 = f"""
    <div class="page">
        <div>
            {render_official_header("1BAC Sciences", "Physics Component" if lang=="en" else "Composante Physique", 2, lang)}
            
            <!-- UNIT 2 -->
            <div class="unit-block">
                <div class="unit-banner">
                    <span>{"Unit 2: Work and Power of a Force" if lang=="en" else "Unité 2 : Travail et Puissance d'une Force"}</span>
                    <span>6 {"Hours" if lang=="en" else "Heures"}</span>
                </div>
                <div class="unit-prereq-problem">
                    <div class="prereq-col">
                        <div class="block-title">{"Prerequisites:" if lang=="en" else "Prérequis :"}</div>
                        {"Forces, translation/rotation motion, dot product of vectors." if lang=="en" else "Forces, mouvements de translation/rotation, produit scalaire."}
                    </div>
                    <div class="problem-col">
                        <div class="block-title">{"Problem Situation:" if lang=="en" else "Situation-Problème :"}</div>
                        {"We commonly say someone does more work by lifting heavy loads. What is mechanical work in physics, and how is power evaluated?" if lang=="en" else "Soulever un fardeau demande du travail. Quelle est la définition physique rigoureuse du travail mécanique et de la puissance ?"}
                    </div>
                </div>
                <table class="pedagogical-table">
                    <thead><tr><th style="width:25%;">{"Objectives" if lang=="en" else "Objectifs"}</th><th style="width:25%;">{"Contents" if lang=="en" else "Contenus"}</th><th style="width:25%;">{"Didactic Materials" if lang=="en" else "Matériel Didactique"}</th><th style="width:25%;">{"Activities & Evaluation" if lang=="en" else "Activités & Évaluation"}</th></tr></thead>
                    <tbody>
                        <tr>
                            <td>
                                <ul>
                                    <li>{"Work of constant force: W_AB(F) = F · AB · cos(α) (Joules)." if lang=="en" else "Travail d'une force constante : W_AB(F) = F · AB · cos(α) (J)."}</li>
                                    <li>{"Motoring work (W > 0), resistive work (W < 0), zero work." if lang=="en" else "Travail moteur (W > 0), résistant (W < 0), nul."}</li>
                                    <li>{"Work of weight: W_AB(P) = ± m·g·h (path-independent)." if lang=="en" else "Travail du poids : W_AB(P) = ± m·g·h (indépendant du chemin)."}</li>
                                    <li>{"Work of torque in rotation: W = M_Δ · Δθ." if lang=="en" else "Travail d'un couple en rotation : W = M_Δ · Δθ."}</li>
                                    <li>{"Average power P_m = W / Δt and instantaneous power P = F · v." if lang=="en" else "Puissance moyenne P_m = W / Δt et instantanée P = F · v (Watts)."}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>I. {"Work of Forces" if lang=="en" else "Travail d'une Force"}</strong> (1. {"Constant force in translation" if lang=="en" else "Force constante en translation"}, 2. {"Work of weight" if lang=="en" else "Travail du poids"}, 3. {"Constant torque in rotation" if lang=="en" else "Couple constant en rotation"})<br>
                                <strong>II. {"Power of Forces" if lang=="en" else "Puissance d'une Force"}</strong> (1. {"Average power" if lang=="en" else "Puissance moyenne"}, 2. {"Instantaneous power in translation P = F·v" if lang=="en" else "Puissance en translation P = F·v"}, 3. {"Instantaneous power in rotation P = M·ω" if lang=="en" else "Puissance en rotation P = M·ω"})
                            </td>
                            <td>
                                <ul>
                                    <li>{"Inclined plane bench, pulleys, dynamometers" if lang=="en" else "Plan incliné, poulies, dynamomètres"}</li>
                                    <li>{"Masses, strings, air track with gliders" if lang=="en" else "Masses marquées, fils, mobile autoporteur"}</li>
                                    <li>{"Winch apparatus for rotational work measurement" if lang=="en" else "Treuil pour mesure de travail de rotation"}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>{"Activities:" if lang=="en" else "Activités :"}</strong> {"Demonstrate that work of weight depends only on vertical elevation h. Compute power of electric winches." if lang=="en" else "Démontrer que le travail du poids ne dépend que du dénivelé h. Calcul de la puissance d'un treuil."}<br>
                                <strong>{"Evaluation:" if lang=="en" else "Évaluation :"}</strong> {"Work calculation problems on inclined planes." if lang=="en" else "Exercices de calcul de travail et puissance."}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- UNIT 3 -->
            <div class="unit-block">
                <div class="unit-banner">
                    <span>{"Unit 3: Work and Kinetic Energy" if lang=="en" else "Unité 3 : Travail et Énergie Cinétique"}</span>
                    <span>5 {"Hours" if lang=="en" else "Heures"}</span>
                </div>
                <div class="unit-prereq-problem">
                    <div class="prereq-col">
                        <div class="block-title">{"Prerequisites:" if lang=="en" else "Prérequis :"}</div>
                        {"Mechanical work, velocity, moment of inertia." if lang=="en" else "Travail mécanique, vitesse, moment d'inertie."}
                    </div>
                    <div class="problem-col">
                        <div class="block-title">{"Problem Situation:" if lang=="en" else "Situation-Problème :"}</div>
                        {"A blender knife rotates faster and grinds food more rapidly because of acquired kinetic energy. How is kinetic energy related to the sum of work done on a solid?" if lang=="en" else "Les lames d'un hachoir acquièrent de l'énergie cinétique. Comment cette énergie est-elle liée aux travaux des forces appliquées ?"}
                    </div>
                </div>
                <table class="pedagogical-table">
                    <thead><tr><th style="width:25%;">{"Objectives" if lang=="en" else "Objectifs"}</th><th style="width:25%;">{"Contents" if lang=="en" else "Contenus"}</th><th style="width:25%;">{"Didactic Materials" if lang=="en" else "Matériel Didactique"}</th><th style="width:25%;">{"Activities & Evaluation" if lang=="en" else "Activités & Évaluation"}</th></tr></thead>
                    <tbody>
                        <tr>
                            <td>
                                <ul>
                                    <li>{"Kinetic energy in translation: E_c = 0.5 · m · v² (Joules)." if lang=="en" else "Énergie cinétique en translation : E_c = 0,5 · m · v²."}</li>
                                    <li>{"Kinetic energy in rotation: E_c = 0.5 · J_Δ · ω²." if lang=="en" else "Énergie cinétique en rotation : E_c = 0,5 · J_Δ · ω²."}</li>
                                    <li>{"Moment of inertia J_Δ in kg·m²." if lang=="en" else "Moment d'inertie J_Δ en kg·m²."}</li>
                                    <li>{"Kinetic Energy Theorem: ΔE_c = E_c2 - E_c1 = Σ W_1→2(F_ext)." if lang=="en" else "Théorème de l'Énergie Cinétique : ΔE_c = Σ W(F_ext)."}</li>
                                    <li>{"Apply theorem to free fall, inclined planes, and rotating solids." if lang=="en" else "Application à la chute libre, plans inclinés et rotation."}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>I. {"Kinetic Energy" if lang=="en" else "Énergie Cinétique"}</strong> (1. {"Solid in translation" if lang=="en" else "Solide en translation"}, 2. {"Solid in rotation" if lang=="en" else "Solide en rotation"})<br>
                                <strong>II. {"Kinetic Energy Theorem" if lang=="en" else "Théorème de l'Énergie Cinétique"}</strong> (1. {"Free fall case" if lang=="en" else "Cas de la chute libre"}, 2. {"Rectilinear translation case" if lang=="en" else "Translation rectiligne"}, 3. {"Rotation case" if lang=="en" else "Rotation autour d'un axe"}, 4. {"Statement" if lang=="en" else "Énoncé"})<br>
                                <strong>III. {"Applications" if lang=="en" else "Applications"}</strong> (1. {"Friction evaluation" if lang=="en" else "Calcul de frottements"}, 2. {"Speed determination" if lang=="en" else "Détermination de vitesses"})
                            </td>
                            <td>
                                <ul>
                                    <li>{"Free fall apparatus with digital optical timer" if lang=="en" else "Appareil de chute libre avec chronomètre optique"}</li>
                                    <li>{"Air track with photogates and hanging load" if lang=="en" else "Banc à air avec fourches optiques et masse tractrice"}</li>
                                    <li>{"Flywheel with cord and weights for rotational study" if lang=="en" else "Volant d'inertie avec fil et masses pour rotation"}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>{"Activities:" if lang=="en" else "Activités :"}</strong> {"Verify experimentally that 0.5·m·v² = m·g·h in free fall. Measure terminal velocity on inclined plane." if lang=="en" else "Vérification expérimentale de 0,5·m·v² = m·g·h en chute libre. Mesure des vitesses sur plan incliné."}<br>
                                <strong>{"Evaluation:" if lang=="en" else "Évaluation :"}</strong> {"Kinetic energy theorem problem solving and Supervised Exam 2." if lang=="en" else "Exercices de résolution par le théorème et Devoir surveillé 2."}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        {render_official_footer(2, lang)}
    </div>
    """
    pages_html.append(p3)

    # ---------------- PAGE 4: MECHANICS UNITS 4 & 5 ----------------
    p4 = f"""
    <div class="page">
        <div>
            {render_official_header("1BAC Sciences", "Physics Component" if lang=="en" else "Composante Physique", 3, lang)}
            
            <!-- UNIT 4 -->
            <div class="unit-block">
                <div class="unit-banner">
                    <span>{"Unit 4: Work and Gravitational Potential Energy" if lang=="en" else "Unité 4 : Travail et Énergie Potentielle de Pesanteur"}</span>
                    <span>5 {"Hours" if lang=="en" else "Heures"}</span>
                </div>
                <div class="unit-prereq-problem">
                    <div class="prereq-col">
                        <div class="block-title">{"Prerequisites:" if lang=="en" else "Prérequis :"}</div>
                        {"Work of weight, elevation, reference state." if lang=="en" else "Travail du poids, dénivelé, état de référence."}
                    </div>
                    <div class="problem-col">
                        <div class="block-title">{"Problem Situation:" if lang=="en" else "Situation-Problème :"}</div>
                        {"Water stored behind high dams stores vast energy called gravitational potential energy. How is this energy expressed and utilized?" if lang=="en" else "L'eau retenue dans un barrage emmagasine une énergie colossale dite potentielle de pesanteur. Comment s'exprime-t-elle ?"}
                    </div>
                </div>
                <table class="pedagogical-table">
                    <thead><tr><th style="width:25%;">{"Objectives" if lang=="en" else "Objectifs"}</th><th style="width:25%;">{"Contents" if lang=="en" else "Contenus"}</th><th style="width:25%;">{"Didactic Materials" if lang=="en" else "Matériel Didactique"}</th><th style="width:25%;">{"Activities & Evaluation" if lang=="en" else "Activités & Évaluation"}</th></tr></thead>
                    <tbody>
                        <tr>
                            <td>
                                <ul>
                                    <li>{"Understand gravitational potential energy E_pp." if lang=="en" else "Notion d'énergie potentielle de pesanteur E_pp."}</li>
                                    <li>{"Formula: E_pp = m · g · z + C (Joules)." if lang=="en" else "Expression : E_pp = m · g · z + Cte (J)."}</li>
                                    <li>{"Choose a reference state (E_pp = 0 at z = 0)." if lang=="en" else "Choix de l'état de référence (E_pp = 0 en z = 0)."}</li>
                                    <li>{"Fundamental relation: ΔE_pp = -W_AB(P) = m·g·(z_B - z_A)." if lang=="en" else "Relation : ΔE_pp = -W_AB(P) = m·g·(z_B - z_A)."}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>I. {"Gravitational Potential Energy" if lang=="en" else "Énergie Potentielle de Pesanteur"}</strong> (1. {"Definition" if lang=="en" else "Définition"}, 2. {"Formula E_pp = m·g·z + C" if lang=="en" else "Formule E_pp = m·g·z + C"}, 3. {"Reference state" if lang=="en" else "État de référence"})<br>
                                <strong>II. {"Variation of Potential Energy" if lang=="en" else "Variation d'Énergie Potentielle"}</strong> (1. {"Relation ΔE_pp = -W(P)" if lang=="en" else "Lien ΔE_pp = -W(P)"}, 2. {"Applications" if lang=="en" else "Applications"})
                            </td>
                            <td>
                                <ul>
                                    <li>{"Textbook, board, computer media" if lang=="en" else "Manuel, tableau, animations TICE"}</li>
                                    <li>{"Stands, vertical scale, steel balls" if lang=="en" else "Supports, réglette graduée, billes"}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>{"Activities:" if lang=="en" else "Activités :"}</strong> {"Establish formula E_pp = m·g·z by integration of weight work. Show that choice of reference changes C but not ΔE_pp." if lang=="en" else "Établissement de la formule et démonstration de l'invariance de ΔE_pp selon la référence."}<br>
                                <strong>{"Evaluation:" if lang=="en" else "Évaluation :"}</strong> {"Potential energy calculations with various reference planes." if lang=="en" else "Exercices avec divers plans de référence."}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- UNIT 5 -->
            <div class="unit-block">
                <div class="unit-banner">
                    <span>{"Unit 5: Mechanical Energy of a Solid Body" if lang=="en" else "Unité 5 : Énergie Mécanique d'un Corps Solide"}</span>
                    <span>6 {"Hours" if lang=="en" else "Heures"}</span>
                </div>
                <div class="unit-prereq-problem">
                    <div class="prereq-col">
                        <div class="block-title">{"Prerequisites:" if lang=="en" else "Prérequis :"}</div>
                        {"Kinetic energy, gravitational potential energy, friction work." if lang=="en" else "Énergie cinétique, énergie potentielle, travail des frottements."}
                    </div>
                    <div class="problem-col">
                        <div class="block-title">{"Problem Situation:" if lang=="en" else "Situation-Problème :"}</div>
                        {"A pole vaulter converts kinetic energy into potential energy during ascent, and back during descent. Is mechanical energy conserved? What happens when friction occurs?" if lang=="en" else "Le perchiste convertit son énergie cinétique en potentielle puis l'inverse. L'énergie mécanique totale est-elle conservée en présence de frottements ?"}
                    </div>
                </div>
                <table class="pedagogical-table">
                    <thead><tr><th style="width:25%;">{"Objectives" if lang=="en" else "Objectifs"}</th><th style="width:25%;">{"Contents" if lang=="en" else "Contenus"}</th><th style="width:25%;">{"Didactic Materials" if lang=="en" else "Matériel Didactique"}</th><th style="width:25%;">{"Activities & Evaluation" if lang=="en" else "Activités & Évaluation"}</th></tr></thead>
                    <tbody>
                        <tr>
                            <td>
                                <ul>
                                    <li>{"Define mechanical energy: E_m = E_c + E_pp (Joules)." if lang=="en" else "Définition : E_m = E_c + E_pp (J)."}</li>
                                    <li>{"Conservation of mechanical energy: ΔE_m = 0 in absence of friction." if lang=="en" else "Conservation : ΔE_m = 0 en l'absence de frottement."}</li>
                                    <li>{"Energy transfer between E_c and E_pp." if lang=="en" else "Transfert mutuel entre E_c et E_pp."}</li>
                                    <li>{"Non-conservation: ΔE_m = W(f) = -Q_thermal." if lang=="en" else "Non-conservation : ΔE_m = W(f) = -Q_thermique."}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>I. {"Mechanical Energy" if lang=="en" else "Énergie Mécanique"}</strong> (1. {"Definition E_m = E_c + E_pp" if lang=="en" else "Définition E_m = E_c + E_pp"})<br>
                                <strong>II. {"Conservation of E_m" if lang=="en" else "Conservation de E_m"}</strong> (1. {"Free fall" if lang=="en" else "Chute libre"}, 2. {"Frictionless inclined plane" if lang=="en" else "Plan incliné sans frottement"}, 3. {"Generalization" if lang=="en" else "Généralisation"})<br>
                                <strong>III. {"Non-Conservation of E_m" if lang=="en" else "Non-Conservation de E_m"}</strong> (1. {"Effect of friction forces" if lang=="en" else "Rôle des forces de frottement"}, 2. {"Thermal energy dissipation ΔE_m = W(f)" if lang=="en" else "Dissipation thermique ΔE_m = W(f)"})
                            </td>
                            <td>
                                <ul>
                                    <li>{"Air cushion table, curved frictionless rail" if lang=="en" else "Table à coussin d'air, rail curviligne sans frottement"}</li>
                                    <li>{"Pendulum with photogate sensors at various heights" if lang=="en" else "Pendule pesant avec capteurs optiques"}</li>
                                    <li>{"Glider with braking friction pad" if lang=="en" else "Mobile avec patin de freinage"}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>{"Activities:" if lang=="en" else "Activités :"}</strong> {"Track oscillating glider; plot E_c(t), E_pp(t), and E_m(t); verify E_m is constant without friction and decreases with friction." if lang=="en" else "Tracé des courbes E_c, E_pp et E_m au cours du temps ; constatation de la conservation ou décroissance."}<br>
                                <strong>{"Evaluation:" if lang=="en" else "Évaluation :"}</strong> {"Mechanical energy conservation problems and Supervised Exam 2." if lang=="en" else "Exercices de conservation et Devoir surveillé 2."}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        {render_official_footer(3, lang)}
    </div>
    """
    pages_html.append(p4)

    # ---------------- PAGE 5: MECHANICS UNITS 6 & 7 ----------------
    p5 = f"""
    <div class="page">
        <div>
            {render_official_header("1BAC Sciences", "Physics Component" if lang=="en" else "Composante Physique", 4, lang)}
            
            <!-- UNIT 6 -->
            <div class="unit-block">
                <div class="unit-banner">
                    <span>{"Unit 6: Work and Internal Energy" if lang=="en" else "Unité 6 : Travail et Énergie Interne"}</span>
                    <span>6 {"Hours" if lang=="en" else "Heures"}</span>
                </div>
                <div class="unit-prereq-problem">
                    <div class="prereq-col">
                        <div class="block-title">{"Prerequisites:" if lang=="en" else "Prérequis :"}</div>
                        {"Mechanical work, gas compression, thermal energy." if lang=="en" else "Travail mécanique, compression d'un gaz, énergie thermique."}
                    </div>
                    <div class="problem-col">
                        <div class="block-title">{"Problem Situation:" if lang=="en" else "Situation-Problème :"}</div>
                        {"Solar radiation heats receiving bodies on Earth. What causes internal temperature rise, and what is the 1st Law of Thermodynamics?" if lang=="en" else "Le rayonnement solaire échauffe les corps. À quoi est due l'élévation de température interne et qu'énonce le premier principe de la thermodynamique ?"}
                    </div>
                </div>
                <table class="pedagogical-table">
                    <thead><tr><th style="width:25%;">{"Objectives" if lang=="en" else "Objectifs"}</th><th style="width:25%;">{"Contents" if lang=="en" else "Contenus"}</th><th style="width:25%;">{"Didactic Materials" if lang=="en" else "Matériel Didactique"}</th><th style="width:25%;">{"Activities & Evaluation" if lang=="en" else "Activités & Évaluation"}</th></tr></thead>
                    <tbody>
                        <tr>
                            <td>
                                <ul>
                                    <li>{"Microscopic interpretation of internal energy U." if lang=="en" else "Interprétation microscopique de l'énergie interne U."}</li>
                                    <li>{"Work of pressing force in gas compression: W = -P · ΔV." if lang=="en" else "Travail de compression : W = -P · ΔV."}</li>
                                    <li>{"Modes of energy transfer: mechanical work W, heat Q, radiation." if lang=="en" else "Modes de transfert : travail W, chaleur Q, rayonnement."}</li>
                                    <li>{"First Law of Thermodynamics: ΔU = W + Q." if lang=="en" else "Premier principe de la thermodynamique : ΔU = W + Q."}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>I. {"Effects of Mechanical Work" if lang=="en" else "Effets du Travail"}</strong> (1. {"Tyndall experiment" if lang=="en" else "Expérience de Tyndall"}, 2. {"Gas compression work W = -P·ΔV" if lang=="en" else "Travail des forces pressantes"})<br>
                                <strong>II. {"Energy Transfer Modes" if lang=="en" else "Modes de Transfert"}</strong> (1. {"Heat conduction" if lang=="en" else "Conduction"}, 2. {"Convection" if lang=="en" else "Convection"}, 3. {"Radiation" if lang=="en" else "Rayonnement"})<br>
                                <strong>III. {"1st Law of Thermodynamics" if lang=="en" else "Premier Principe"}</strong> (1. {"Internal energy U" if lang=="en" else "Énergie interne U"}, 2. {"Equation ΔU = W + Q" if lang=="en" else "Bilan ΔU = W + Q"})
                            </td>
                            <td>
                                <ul>
                                    <li>{"Digital thermometers, lead shot in insulated tube" if lang=="en" else "Thermomètres numériques, tube à grenaille de plomb"}</li>
                                    <li>{"Syringe fitted with temperature and pressure sensors" if lang=="en" else "Seringue étanche avec sondes T et P"}</li>
                                    <li>{"Polystyrene calorimeter, heating mantle" if lang=="en" else "Calorimètre en polystyrène, chauffe-ballon"}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>{"Activities:" if lang=="en" else "Activités :"}</strong> {"Shake lead shot in cylinder; measure temperature rise resulting from mechanical work. Rapidly compress air in syringe and record T increase." if lang=="en" else "Agitation de grenaille de plomb et mesure de l'élévation de température. Compression rapide d'air en seringue."}<br>
                                <strong>{"Evaluation:" if lang=="en" else "Évaluation :"}</strong> {"Thermodynamic cycle calculations and ΔU problem sets." if lang=="en" else "Exercices d'application du premier principe ΔU = W + Q."}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- UNIT 7 -->
            <div class="unit-block">
                <div class="unit-banner">
                    <span>{"Unit 7: Thermal Energy: Heat Transfer" if lang=="en" else "Unité 7 : L'Énergie Thermique : Transfert Thermique"}</span>
                    <span>8 {"Hours" if lang=="en" else "Heures"}</span>
                </div>
                <div class="unit-prereq-problem">
                    <div class="prereq-col">
                        <div class="block-title">{"Prerequisites:" if lang=="en" else "Prérequis :"}</div>
                        {"Temperature, thermal equilibrium, internal energy." if lang=="en" else "Température, équilibre thermique, énergie interne."}
                    </div>
                    <div class="problem-col">
                        <div class="block-title">{"Problem Situation:" if lang=="en" else "Situation-Problème :"}</div>
                        {"Bodies exchange thermal energy until reaching thermal equilibrium. How is heat expressed without phase change, and what is latent heat of melting or boiling?" if lang=="en" else "Les corps échangent de la chaleur jusqu'à l'équilibre. Comment s'exprime le transfert thermique sans et avec changement d'état ?"}
                    </div>
                </div>
                <table class="pedagogical-table">
                    <thead><tr><th style="width:25%;">{"Objectives" if lang=="en" else "Objectifs"}</th><th style="width:25%;">{"Contents" if lang=="en" else "Contenus"}</th><th style="width:25%;">{"Didactic Materials" if lang=="en" else "Matériel Didactique"}</th><th style="width:25%;">{"Activities & Evaluation" if lang=="en" else "Activités & Évaluation"}</th></tr></thead>
                    <tbody>
                        <tr>
                            <td>
                                <ul>
                                    <li>{"Heat quantity formula: Q = m · c · (θ_f - θ_i) (Joules)." if lang=="en" else "Expression : Q = m · c · (θ_f - θ_i) (J)."}</li>
                                    <li>{"Specific heat capacity c (J/(kg·°C)) & heat capacity C = m·c." if lang=="en" else "Capacité thermique massique c (J·kg⁻¹·K⁻¹)."}</li>
                                    <li>{"Calorimeter thermal equilibrium: Σ Q_i = 0." if lang=="en" else "Équilibre thermique du calorimètre : Σ Q_i = 0."}</li>
                                    <li>{"Determine calorimeter heat capacity C_cal and metal specific heat c." if lang=="en" else "Détermination de la capacité C_cal et de c d'un métal."}</li>
                                    <li>{"Latent heat of phase change: Q = m · L (melting, boiling)." if lang=="en" else "Chaleur latente de changement d'état : Q = m · L."}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>I. {"Heat Transfer without Phase Change" if lang=="en" else "Transfert Sans Changement d'État"}</strong> (1. {"Heat quantity Q" if lang=="en" else "Quantité de chaleur Q"}, 2. {"Specific heat c" if lang=="en" else "Capacité massique c"}, 3. {"Thermal equilibrium" if lang=="en" else "Équilibre thermique"})<br>
                                <strong>II. {"Calorimetry Experimental Study" if lang=="en" else "Calorimétrie"}</strong> (1. {"Calorimeter description" if lang=="en" else "Description du calorimètre"}, 2. {"Determination of C_cal" if lang=="en" else "Détermination de C_cal"}, 3. {"Measuring metal specific heat" if lang=="en" else "Mesure de c d'un métal"})<br>
                                <strong>III. {"Heat Transfer with Phase Change" if lang=="en" else "Transfert Avec Changement d'État"}</strong> (1. {"Latent heat L" if lang=="en" else "Chaleur latente L"}, 2. {"Melting of ice L_f" if lang=="en" else "Fusion de la glace L_f"}, 3. {"Vaporization L_v" if lang=="en" else "Vaporisation L_v"})
                            </td>
                            <td>
                                <ul>
                                    <li>{"Adiabatic calorimeter with accessories and stirrer" if lang=="en" else "Calorimètre adiabatique avec agitateur"}</li>
                                    <li>{"Digital precision thermometers (0.1°C resolution)" if lang=="en" else "Thermomètres numériques au 1/10ème de °C"}</li>
                                    <li>{"Calibrated metal cylinders (Cu, Al, Fe, Pb), melting ice" if lang=="en" else "Cylindres métalliques (Cu, Al, Fe, Pb), glace fondante"}</li>
                                    <li>{"Electric immersion heater and precision balance" if lang=="en" else "Thermoplongeur électrique et balance de précision"}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>{"Activities:" if lang=="en" else "Activités :"}</strong> {"Determine calorimeter heat capacity by mixing hot and cold water. Immerse heated copper block to measure c_Cu. Melt ice to find L_f." if lang=="en" else "Mesure de C_cal par méthode des mélanges ; mesure de c_Cu et de la chaleur latente de fusion de la glace L_f."}<br>
                                <strong>{"Evaluation:" if lang=="en" else "Évaluation :"}</strong> {"Thermal equilibrium equations and Supervised Exam 3." if lang=="en" else "Calculs de bilans calorimétriques et Devoir surveillé 3."}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        {render_official_footer(4, lang)}
    </div>
    """
    pages_html.append(p5)

    # ---------------- PAGE 6: ELECTRICITY UNIT 1 ----------------
    p6 = f"""
    <div class="page">
        <div>
            {render_official_header("1BAC Sciences", "Physics Component" if lang=="en" else "Composante Physique", 5, lang)}
            <div class="overview-box">
                <div class="overview-title">{"Part 2: Dynamic Electricity & Electromagnetism (23 - 43 Hours)" if lang=="en" else "Partie 2 : L'Électricité Dynamique et Électromagnétisme (23 - 43 Heures)"}</div>
                <div class="overview-grid">
                    <div>
                        <strong>{"Competencies:" if lang=="en" else "Compétences Visées :"}</strong>
                        {"Understand electric and magnetic fields, energy conservation in circuits, Laplace electromagnetic force, electrical safety precautions, and applications in motors and communication." if lang=="en" else "Maîtriser les champs électrique et magnétique, le bilan d'énergie des circuits, les forces de Laplace, la sécurité électrique et les applications motrices."}
                    </div>
                    <div>
                        <strong>{"Part Units Breakdown:" if lang=="en" else "Unités de la Partie :"}</strong>
                        1. {"Electrostatic Field (4h)" if lang=="en" else "Champ électrostatique (4h)"} • 
                        2. {"Electrostatic Potential Energy (6h)" if lang=="en" else "Énergie potentielle électrostatique (6h)"} • 
                        3. {"Energy Transfer in Circuits (6-7h)" if lang=="en" else "Transfert d'énergie dans un circuit (6-7h)"} • 
                        4. {"Circuit General Behavior (5-9h)" if lang=="en" else "Comportement global d'un circuit (5-9h)"} • 
                        5. {"Magnetic Field (3-4h)" if lang=="en" else "Champ magnétique (3-4h)"} • 
                        6. {"Current Magnetic Field (4-6h)" if lang=="en" else "Champ créé par un courant (4-6h)"} • 
                        7. {"Laplace's Law (5-7h)" if lang=="en" else "Loi de Laplace (5-7h)"}
                    </div>
                </div>
            </div>

            <!-- UNIT 1 -->
            <div class="unit-block">
                <div class="unit-banner">
                    <span>{"Unit 1: The Electrostatic Field" if lang=="en" else "Unité 1 : Le Champ Électrostatique"}</span>
                    <span>4 {"Hours" if lang=="en" else "Heures"}</span>
                </div>
                <div class="unit-prereq-problem">
                    <div class="prereq-col">
                        <div class="block-title">{"Prerequisites:" if lang=="en" else "Prérequis :"}</div>
                        {"Electrostatic electrification, positive/negative charges, Coulomb interaction." if lang=="en" else "Électrisation, charges positives et négatives, interaction de Coulomb."}
                    </div>
                    <div class="problem-col">
                        <div class="block-title">{"Problem Situation:" if lang=="en" else "Situation-Problème :"}</div>
                        {"Particle accelerators accelerate charged particles using electrostatic fields. What is an electric field, how is it represented, and what is a uniform field?" if lang=="en" else "Les accélérateurs accélèrent des particules grâce au champ électrostatique. Qu'est-ce qu'un champ électrique et comment se définit un champ uniforme ?"}
                    </div>
                </div>
                <table class="pedagogical-table">
                    <thead><tr><th style="width:25%;">{"Objectives" if lang=="en" else "Objectifs"}</th><th style="width:25%;">{"Contents" if lang=="en" else "Contenus"}</th><th style="width:25%;">{"Didactic Materials" if lang=="en" else "Matériel Didactique"}</th><th style="width:25%;">{"Activities & Evaluation" if lang=="en" else "Activités & Évaluation"}</th></tr></thead>
                    <tbody>
                        <tr>
                            <td>
                                <ul>
                                    <li>{"Coulomb's Law: F = k · (|q₁·q₂|) / d²." if lang=="en" else "Loi de Coulomb : F = k · (|q₁·q₂|) / d²."}</li>
                                    <li>{"Electrostatic field vector E: F = q · E (V/m or N/C)." if lang=="en" else "Vecteur champ E : F = q · E (V/m ou N/C)."}</li>
                                    <li>{"Superposition principle: E = E₁ + E₂." if lang=="en" else "Principe de superposition : E = E₁ + E₂."}</li>
                                    <li>{"Field lines and electrostatic field spectra." if lang=="en" else "Lignes de champ et spectre électrostatique."}</li>
                                    <li>{"Uniform electric field between parallel plates: E = U / d." if lang=="en" else "Champ uniforme entre armatures planes : E = U / d."}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>I. {"Coulomb Interaction" if lang=="en" else "Interaction de Coulomb"}</strong> (1. {"Point charges" if lang=="en" else "Charges ponctuelles"}, 2. {"Coulomb's Law" if lang=="en" else "Loi de Coulomb"})<br>
                                <strong>II. {"Electrostatic Field Vector" if lang=="en" else "Vecteur Champ Électrostatique"}</strong> (1. {"Definition F = q·E" if lang=="en" else "Définition F = q·E"}, 2. {"Field of point charge" if lang=="en" else "Champ d'une charge ponctuelle"}, 3. {"Superposition" if lang=="en" else "Superposition"})<br>
                                <strong>III. {"Field Lines & Uniform Field" if lang=="en" else "Spectres & Champ Uniforme"}</strong> (1. {"Field lines mapping" if lang=="en" else "Lignes de champ"}, 2. {"Uniform field E = U/d" if lang=="en" else "Champ uniforme E = U/d"})
                            </td>
                            <td>
                                <ul>
                                    <li>{"High-voltage generator (HT 0-5kV)" if lang=="en" else "Générateur haute tension (0-5 kV)"}</li>
                                    <li>{"Parallel metal plates capacitor, paraffin oil tank" if lang=="en" else "Plaques parallèles, cuve d'huile de paraffine"}</li>
                                    <li>{"Semolina grains, electrostatic pendulum" if lang=="en" else "Grains de semoule, pendule électrostatique"}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>{"Activities:" if lang=="en" else "Activités :"}</strong> {"Visualize field lines using semolina grains aligning in electric field between parallel plates and point charges." if lang=="en" else "Visualisation des lignes de champ dans l'huile avec la semoule entre plaques et pointes."}<br>
                                <strong>{"Evaluation:" if lang=="en" else "Évaluation :"}</strong> {"Field vector superposition problems and Coulomb calculations." if lang=="en" else "Calculs vectoriels de champ et Devoir surveillé 3."}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        {render_official_footer(5, lang)}
    </div>
    """
    pages_html.append(p6)

    # ---------------- PAGE 7: ELECTRICITY UNITS 2 & 3 ----------------
    p7 = f"""
    <div class="page">
        <div>
            {render_official_header("1BAC Sciences", "Physics Component" if lang=="en" else "Composante Physique", 6, lang)}
            
            <!-- UNIT 2 -->
            <div class="unit-block">
                <div class="unit-banner">
                    <span>{"Unit 2: Potential Energy of an Electric Charge in Uniform Electrostatic Field" if lang=="en" else "Unité 2 : Énergie Potentielle d'une Charge dans un Champ Électrostatique Uniforme"}</span>
                    <span>6 {"Hours" if lang=="en" else "Heures"}</span>
                </div>
                <div class="unit-prereq-problem">
                    <div class="prereq-col">
                        <div class="block-title">{"Prerequisites:" if lang=="en" else "Prérequis :"}</div>
                        {"Electrostatic field, work of constant force, kinetic energy." if lang=="en" else "Champ électrostatique, travail d'une force, énergie cinétique."}
                    </div>
                    <div class="problem-col">
                        <div class="block-title">{"Problem Situation:" if lang=="en" else "Situation-Problème :"}</div>
                        {"Lightning discharges huge electrostatic energy between clouds and ground. How is electrostatic potential energy defined and related to voltage?" if lang=="en" else "L'éclair libère l'énergie accumulée entre nuages et sol. Comment définir l'énergie potentielle électrostatique et la relier à la tension ?"}
                    </div>
                </div>
                <table class="pedagogical-table">
                    <thead><tr><th style="width:25%;">{"Objectives" if lang=="en" else "Objectifs"}</th><th style="width:25%;">{"Contents" if lang=="en" else "Contenus"}</th><th style="width:25%;">{"Didactic Materials" if lang=="en" else "Matériel Didactique"}</th><th style="width:25%;">{"Activities & Evaluation" if lang=="en" else "Activités & Évaluation"}</th></tr></thead>
                    <tbody>
                        <tr>
                            <td>
                                <ul>
                                    <li>{"Work of electrostatic force: W_AB(F_e) = q · E · AB = q · (V_A - V_B)." if lang=="en" else "Travail de la force : W_AB(F_e) = q · (V_A - V_B)."}</li>
                                    <li>{"Electric potential V (Volts) & equipotential surfaces." if lang=="en" else "Potentiel V (V) et surfaces équipotentielles."}</li>
                                    <li>{"Electrostatic potential energy: E_pe = q · V + C (Joules)." if lang=="en" else "Énergie potentielle : E_pe = q · V + Cte (J)."}</li>
                                    <li>{"Relation ΔE_pe = -W_AB(F_e) = q · (V_B - V_A)." if lang=="en" else "Relation ΔE_pe = -W_AB(F_e)."}</li>
                                    <li>{"Conservation of total energy: E_T = E_c + E_pe = const." if lang=="en" else "Conservation de l'énergie totale : E_T = E_c + E_pe."}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>I. {"Work of Electrostatic Force" if lang=="en" else "Travail de la Force Électrique"}</strong> (1. {"Uniform field work W = q·E·AB" if lang=="en" else "Travail en champ uniforme"}, 2. {"Potential difference V_A - V_B" if lang=="en" else "Différence de potentiel"})<br>
                                <strong>II. {"Electric Potential" if lang=="en" else "Potentiel Électrique"}</strong> (1. {"Equipotential lines" if lang=="en" else "Surfaces équipotentielles"}, 2. {"Field-potential relation E = -dV/dx" if lang=="en" else "Lien champ-potentiel"})<br>
                                <strong>III. {"Potential & Total Energy" if lang=="en" else "Énergie Potentielle et Totale"}</strong> (1. {"Formula E_pe = q·V" if lang=="en" else "Formule E_pe = q·V"}, 2. {"Total energy conservation ΔE_T = 0" if lang=="en" else "Conservation de l'énergie totale"})
                            </td>
                            <td>
                                <ul>
                                    <li>{"Conductive paper with electrolytic mapping tray" if lang=="en" else "Cuve rhéographique avec papier conducteur"}</li>
                                    <li>{"Voltmeter with exploration probe, DC voltage source" if lang=="en" else "Voltmètre avec sonde mobile, alimentation continue"}</li>
                                    <li>{"Computer animations of electron deflection" if lang=="en" else "Simulations d'accélération d'électrons"}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>{"Activities:" if lang=="en" else "Activités :"}</strong> {"Map equipotential lines between parallel electrodes with exploration probe. Calculate velocity of accelerated electron (0.5 m v² = e·U)." if lang=="en" else "Tracé des lignes équipotentielles à la sonde. Calcul de la vitesse d'un électron accéléré."}<br>
                                <strong>{"Evaluation:" if lang=="en" else "Évaluation :"}</strong> {"Equipotential mapping exercises and kinetic energy problem sets." if lang=="en" else "Exercices sur le potentiel et Devoir surveillé 3."}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- UNIT 3 -->
            <div class="unit-block">
                <div class="unit-banner">
                    <span>{"Unit 3: Energy Transfer in an Electric Circuit" if lang=="en" else "Unité 3 : Transfert d'Énergie dans un Circuit Électrique"}</span>
                    <span>7 {"Hours" if lang=="en" else "Heures"}</span>
                </div>
                <div class="unit-prereq-problem">
                    <div class="prereq-col">
                        <div class="block-title">{"Prerequisites:" if lang=="en" else "Prérequis :"}</div>
                        {"Current, voltage, Ohm's law, Joulean dissipation." if lang=="en" else "Courant, tension, loi d'Ohm, effet Joule."}
                    </div>
                    <div class="problem-col">
                        <div class="block-title">{"Problem Situation:" if lang=="en" else "Situation-Problème :"}</div>
                        {"Car headlights convert electrical energy into light while losing part as heat. What are energy transfers across receivers and generators, and what is Joule's law?" if lang=="en" else "Les phares convertissent l'électricité en lumière avec perte thermique par effet Joule. Quels sont les bilans énergétiques aux bornes des dipôles ?"}
                    </div>
                </div>
                <table class="pedagogical-table">
                    <thead><tr><th style="width:25%;">{"Objectives" if lang=="en" else "Objectifs"}</th><th style="width:25%;">{"Contents" if lang=="en" else "Contenus"}</th><th style="width:25%;">{"Didactic Materials" if lang=="en" else "Matériel Didactique"}</th><th style="width:25%;">{"Activities & Evaluation" if lang=="en" else "Activités & Évaluation"}</th></tr></thead>
                    <tbody>
                        <tr>
                            <td>
                                <ul>
                                    <li>{"Electrical energy transferred: W = U · I · Δt (Joules)." if lang=="en" else "Énergie électrique : W = U · I · Δt (J)."}</li>
                                    <li>{"Electrical power: P = U · I (Watts)." if lang=="en" else "Puissance électrique : P = U · I (W)."}</li>
                                    <li>{"Joule's law in resistors: W_J = R · I² · Δt." if lang=="en" else "Effet Joule : W_J = R · I² · Δt (P_J = R·I²)."}</li>
                                    <li>{"Energy balance of receiver: W = W_u + W_J = E'·I·Δt + r'·I²·Δt." if lang=="en" else "Bilan récepteur : W = E'·I·Δt + r'·I²·Δt."}</li>
                                    <li>{"Energy balance of generator: W_total = W_supplied + W_internal." if lang=="en" else "Bilan générateur : W_chimique = U·I·Δt + r·I²·Δt."}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>I. {"Electric Receiver Energy" if lang=="en" else "Bilan au Niveau d'un Récepteur"}</strong> (1. {"Transferred energy W = U·I·Δt" if lang=="en" else "Énergie reçue W = U·I·Δt"}, 2. {"Useful energy W_u = E'·I·Δt" if lang=="en" else "Énergie utile"}, 3. {"Joule dissipation" if lang=="en" else "Pertes Joule"})<br>
                                <strong>II. {"Joule's Law" if lang=="en" else "L'Effet Joule"}</strong> (1. {"Joule formula W = R·I²·Δt" if lang=="en" else "Loi de Joule"}, 2. {"Calorimetric verification" if lang=="en" else "Vérification calorimétrique"}, 3. {"Applications & drawbacks" if lang=="en" else "Applications"})<br>
                                <strong>III. {"Electric Generator Energy" if lang=="en" else "Bilan au Niveau d'un Générateur"}</strong> (1. {"Provided energy U·I·Δt" if lang=="en" else "Énergie fournie"}, 2. {"Total energy E·I·Δt" if lang=="en" else "Énergie totale"})
                            </td>
                            <td>
                                <ul>
                                    <li>{"Calorimeter with heating resistor, thermometer" if lang=="en" else "Calorimètre avec résistance chauffante, thermomètre"}</li>
                                    <li>{"Small DC motor with pulley and lifting mass" if lang=="en" else "Petit moteur électrique avec treuil et charge"}</li>
                                    <li>{"DC power supply, ammeters, voltmeters, rheostat" if lang=="en" else "Alimentation continue, multimètres, rhéostat"}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>{"Activities:" if lang=="en" else "Activités :"}</strong> {"Verify Joule's law by heating water in calorimeter: measure electrical energy W = U·I·t vs thermal energy m·c·Δθ. Measure motor mechanical efficiency." if lang=="en" else "Vérification de l'effet Joule dans un calorimètre : U·I·t comparé à m·c·Δθ. Mesure du rendement d'un moteur."}<br>
                                <strong>{"Evaluation:" if lang=="en" else "Évaluation :"}</strong> {"Energy balance calculations and efficiency determinations." if lang=="en" else "Exercices de bilans énergétiques et rendements."}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        {render_official_footer(6, lang)}
    </div>
    """
    pages_html.append(p7)

    # ---------------- PAGE 8: ELECTRICITY UNITS 4 & 5 ----------------
    p8 = f"""
    <div class="page">
        <div>
            {render_official_header("1BAC Sciences", "Physics Component" if lang=="en" else "Composante Physique", 7, lang)}
            
            <!-- UNIT 4 -->
            <div class="unit-block">
                <div class="unit-banner">
                    <span>{"Unit 4: General Behavior of an Electric Circuit" if lang=="en" else "Unité 4 : Comportement Global d'un Circuit Électrique"}</span>
                    <span>6 {"Hours" if lang=="en" else "Heures"}</span>
                </div>
                <div class="unit-prereq-problem">
                    <div class="prereq-col">
                        <div class="block-title">{"Prerequisites:" if lang=="en" else "Prérequis :"}</div>
                        {"Pouillet's law, generator/receiver equations, Joule effect." if lang=="en" else "Loi de Pouillet, équations des dipôles, effet Joule."}
                    </div>
                    <div class="problem-col">
                        <div class="block-title">{"Problem Situation:" if lang=="en" else "Situation-Problème :"}</div>
                        {"Computer cooling fans dissipate thermal energy produced by circuits. How is electrical energy distributed across a complete circuit, and how is efficiency optimized?" if lang=="en" else "Les ventilateurs dissipent la chaleur des composants. Comment l'énergie se répartit-elle dans un circuit global et comment optimiser le rendement ?"}
                    </div>
                </div>
                <table class="pedagogical-table">
                    <thead><tr><th style="width:25%;">{"Objectives" if lang=="en" else "Objectifs"}</th><th style="width:25%;">{"Contents" if lang=="en" else "Contenus"}</th><th style="width:25%;">{"Didactic Materials" if lang=="en" else "Matériel Didactique"}</th><th style="width:25%;">{"Activities & Evaluation" if lang=="en" else "Activités & Évaluation"}</th></tr></thead>
                    <tbody>
                        <tr>
                            <td>
                                <ul>
                                    <li>{"Energy distribution in circuit during duration Δt." if lang=="en" else "Distribution d'énergie pendant Δt."}</li>
                                    <li>{"Receiver efficiency: η_r = W_u / W_rec = E' / U." if lang=="en" else "Rendement d'un récepteur : η_r = E' / U."}</li>
                                    <li>{"Generator efficiency: η_g = U / E." if lang=="en" else "Rendement d'un générateur : η_g = U / E."}</li>
                                    <li>{"Overall circuit efficiency: η_global = Σ W_useful / Σ W_total." if lang=="en" else "Rendement global du circuit : η_global."}</li>
                                    <li>{"Factors affecting generator output energy (influence of R_eq)." if lang=="en" else "Facteurs influençant l'énergie fournie."}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>I. {"Circuit Energy Distribution" if lang=="en" else "Répartition de l'Énergie"}</strong> (1. {"Receiver energy balance" if lang=="en" else "Bilan au récepteur"}, 2. {"Generator energy balance" if lang=="en" else "Bilan au générateur"}, 3. {"Circuit overall efficiency" if lang=="en" else "Rendement global"})<br>
                                <strong>II. {"Influencing Factors" if lang=="en" else "Facteurs d'Influence"}</strong> (1. {"Circuit current in resistive load" if lang=="en" else "Courant dans circuit résistif"}, 2. {"Influence of EMF and equivalent resistance" if lang=="en" else "Rôle de E et R_eq"})
                            </td>
                            <td>
                                <ul>
                                    <li>{"Batteries with non-negligible internal resistance r" if lang=="en" else "Générateurs à résistance interne non négligeable"}</li>
                                    <li>{"DC motor, resistor decade boxes, multimeters" if lang=="en" else "Moteur, boîtes de résistances à décades, multimètres"}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>{"Activities:" if lang=="en" else "Activités :"}</strong> {"Connect motor and variable resistors; calculate power transferred and plot efficiency η vs circuit load." if lang=="en" else "Câblage d'un circuit complet et calcul des rendements en fonction de la charge."}<br>
                                <strong>{"Evaluation:" if lang=="en" else "Évaluation :"}</strong> {"Circuit energy balance calculations and Exam 4." if lang=="en" else "Exercices de rendement global et Devoir surveillé 4."}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- UNIT 5 -->
            <div class="unit-block">
                <div class="unit-banner">
                    <span>{"Unit 5: The Magnetic Field" if lang=="en" else "Unité 5 : Le Champ Magnétique"}</span>
                    <span>4 {"Hours" if lang=="en" else "Heures"}</span>
                </div>
                <div class="unit-prereq-problem">
                    <div class="prereq-col">
                        <div class="block-title">{"Prerequisites:" if lang=="en" else "Prérequis :"}</div>
                        {"Magnets (North/South poles), compass needle orientation." if lang=="en" else "Aimants (pôles N et S), boussole et son orientation."}
                    </div>
                    <div class="problem-col">
                        <div class="block-title">{"Problem Situation:" if lang=="en" else "Situation-Problème :"}</div>
                        {"Migratory birds navigate using Earth's geomagnetic field. What is a magnetic field? What are its sources, properties, and how is it measured?" if lang=="en" else "Les oiseaux migrateurs s'orientent grâce au champ magnétique terrestre. Qu'est-ce que le champ magnétique, ses sources et comment le mesurer ?"}
                    </div>
                </div>
                <table class="pedagogical-table">
                    <thead><tr><th style="width:25%;">{"Objectives" if lang=="en" else "Objectifs"}</th><th style="width:25%;">{"Contents" if lang=="en" else "Contenus"}</th><th style="width:25%;">{"Didactic Materials" if lang=="en" else "Matériel Didactique"}</th><th style="width:25%;">{"Activities & Evaluation" if lang=="en" else "Activités & Évaluation"}</th></tr></thead>
                    <tbody>
                        <tr>
                            <td>
                                <ul>
                                    <li>{"Detect magnetic fields with compass needles." if lang=="en" else "Mise en évidence par l'aiguille aimantée."}</li>
                                    <li>{"Magnetic field vector B (Tesla) characteristics." if lang=="en" else "Vecteur champ magnétique B (Tesla)."}</li>
                                    <li>{"Measure magnetic field with a Teslameter." if lang=="en" else "Mesure du champ au teslamètre."}</li>
                                    <li>{"Map field lines and magnetic spectra using iron filings." if lang=="en" else "Spectres magnétiques avec la limaille de fer."}</li>
                                    <li>{"Earth's magnetic field components (B_h horizontal, B_v vertical)." if lang=="en" else "Composantes du champ terrestre (B_h et B_v)."}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>I. {"Magnetic Field Evidence" if lang=="en" else "Mise en Évidence"}</strong> (1. {"Compass needle detection" if lang=="en" else "Détection par boussole"}, 2. {"Magnet interaction" if lang=="en" else "Interaction entre aimants"}, 3. {"DC current effect" if lang=="en" else "Action d'un courant"})<br>
                                <strong>II. {"Magnetic Field Vector" if lang=="en" else "Vecteur Champ Magnétique"}</strong> (1. {"Vector B definition" if lang=="en" else "Définition de B"}, 2. {"Field lines & bar/horseshoe spectra" if lang=="en" else "Lignes de champ et spectres"}, 3. {"Superposition" if lang=="en" else "Superposition"})<br>
                                <strong>III. {"Terrestrial Magnetic Field" if lang=="en" else "Champ Magnétique Terrestre"}</strong>
                            </td>
                            <td>
                                <ul>
                                    <li>{"Bar magnets, horseshoe magnets, compass needles" if lang=="en" else "Aimants droits, en U, aiguilles aimantées"}</li>
                                    <li>{"Digital Teslameter with Hall probe" if lang=="en" else "Teslamètre numérique avec sonde de Hall"}</li>
                                    <li>{"Iron filings on glass plates, Earth induction compass" if lang=="en" else "Limaille de fer sur plaques de verre, boussole d'inclinaison"}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>{"Activities:" if lang=="en" else "Activités :"}</strong> {"Sprinkle iron filings on magnet to observe field lines. Measure field intensity B with Teslameter at varying distances." if lang=="en" else "Tracé des lignes de champ à la limaille de fer. Mesure de B au teslamètre en fonction de la distance."}<br>
                                <strong>{"Evaluation:" if lang=="en" else "Évaluation :"}</strong> {"Magnetic vector superposition exercises and Hall probe reading tests." if lang=="en" else "Exercices de superposition de champs magnétiques."}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        {render_official_footer(7, lang)}
    </div>
    """
    pages_html.append(p8)

    # ---------------- PAGE 9: ELECTRICITY UNITS 6 & 7 ----------------
    p9 = f"""
    <div class="page">
        <div>
            {render_official_header("1BAC Sciences", "Physics Component" if lang=="en" else "Composante Physique", 8, lang)}
            
            <!-- UNIT 6 -->
            <div class="unit-block">
                <div class="unit-banner">
                    <span>{"Unit 6: Magnetic Field Created by an Electric Current" if lang=="en" else "Unité 6 : Champ Magnétique Créé par un Courant Électrique"}</span>
                    <span>5 {"Hours" if lang=="en" else "Heures"}</span>
                </div>
                <div class="unit-prereq-problem">
                    <div class="prereq-col">
                        <div class="block-title">{"Prerequisites:" if lang=="en" else "Prérequis :"}</div>
                        {"Magnetic field vector, electric current, Teslameter." if lang=="en" else "Vecteur champ magnétique, courant électrique, teslamètre."}
                    </div>
                    <div class="problem-col">
                        <div class="block-title">{"Problem Situation:" if lang=="en" else "Situation-Problème :"}</div>
                        {"In 1820, Oersted discovered that electric current deflects a compass needle. What are the magnetic fields created by straight wires, coils, and solenoids?" if lang=="en" else "En 1820, Oersted découvrit que le courant dévie une boussole. Comment exprimer le champ créé par un fil, une bobine ou un solénoïde ?"}
                    </div>
                </div>
                <table class="pedagogical-table">
                    <thead><tr><th style="width:25%;">{"Objectives" if lang=="en" else "Objectifs"}</th><th style="width:25%;">{"Contents" if lang=="en" else "Contenus"}</th><th style="width:25%;">{"Didactic Materials" if lang=="en" else "Matériel Didactique"}</th><th style="width:25%;">{"Activities & Evaluation" if lang=="en" else "Activités & Évaluation"}</th></tr></thead>
                    <tbody>
                        <tr>
                            <td>
                                <ul>
                                    <li>{"Field of straight conductor: B = μ₀ · I / (2π · d)." if lang=="en" else "Champ d'un fil rectiligne : B = μ₀·I / (2π·d)."}</li>
                                    <li>{"Field of flat circular coil: B = μ₀ · N · I / (2 · R)." if lang=="en" else "Champ au centre d'une bobine plate : B = μ₀·N·I / (2R)."}</li>
                                    <li>{"Field inside long solenoid: B = μ₀ · n · I = μ₀ · (N/L) · I." if lang=="en" else "Champ dans un solénoïde : B = μ₀·n·I = μ₀·(N/L)·I."}</li>
                                    <li>{"Right-hand rule and Ampère's observer rule for B direction." if lang=="en" else "Règle de la main droite et bonhomme d'Ampère."}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>I. {"Straight Conductor" if lang=="en" else "Conducteur Rectiligne"}</strong> (1. {"Concentric field lines" if lang=="en" else "Spectre circulaire"}, 2. {"Right-hand rule" if lang=="en" else "Règle de la main droite"}, 3. {"Formula B = μ₀·I/(2πd)" if lang=="en" else "Formule"})<br>
                                <strong>II. {"Flat Circular Coil" if lang=="en" else "Bobine Plate"}</strong> (1. {"Field lines" if lang=="en" else "Spectre"}, 2. {"Center field formula B = μ₀·N·I/(2R)" if lang=="en" else "Champ au centre"})<br>
                                <strong>III. {"Solenoid" if lang=="en" else "Solénoïde"}</strong> (1. {"Uniform interior field" if lang=="en" else "Champ uniforme intérieur"}, 2. {"Formula B = μ₀·n·I" if lang=="en" else "Formule B = μ₀·n·I"})
                            </td>
                            <td>
                                <ul>
                                    <li>{"Straight vertical wire assembly, flat circular coils" if lang=="en" else "Montage fil rectiligne, bobines plates"}</li>
                                    <li>{"Long study solenoid (L > 5R), magnetic needle" if lang=="en" else "Solénoïde long d'étude, aiguille aimantée"}</li>
                                    <li>{"High-current DC power supply (0-5A), Teslameter" if lang=="en" else "Alimentation continue forte intensité (0-5A), teslamètre"}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>{"Activities:" if lang=="en" else "Activités :"}</strong> {"Measure B in solenoid vs current I; verify linear relationship B = k·I and calculate permeability μ₀." if lang=="en" else "Mesure de B en fonction de I dans le solénoïde et vérification de B = μ₀·n·I."}<br>
                                <strong>{"Evaluation:" if lang=="en" else "Évaluation :"}</strong> {"Calculations of magnetic fields for various wire geometries." if lang=="en" else "Exercices de calcul de champs magnétiques."}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- UNIT 7 -->
            <div class="unit-block">
                <div class="unit-banner">
                    <span>{"Unit 7: Electromagnetic Force - Laplace's Law" if lang=="en" else "Unité 7 : La Force Électromagnétique - Loi de Laplace"}</span>
                    <span>6 {"Hours" if lang=="en" else "Heures"}</span>
                </div>
                <div class="unit-prereq-problem">
                    <div class="prereq-col">
                        <div class="block-title">{"Prerequisites:" if lang=="en" else "Prérequis :"}</div>
                        {"Magnetic field B, current I, vectors." if lang=="en" else "Champ magnétique B, courant électrique I, vecteurs."}
                    </div>
                    <div class="problem-col">
                        <div class="block-title">{"Problem Situation:" if lang=="en" else "Situation-Problème :"}</div>
                        {"Electric motors and loudspeakers convert electrical current into mechanical motion using Laplace electromagnetic forces. What defines the Laplace force?" if lang=="en" else "Les moteurs électriques et haut-parleurs convertissent l'électricité en mouvement grâce aux forces de Laplace. Comment caractériser cette force ?"}
                    </div>
                </div>
                <table class="pedagogical-table">
                    <thead><tr><th style="width:25%;">{"Objectives" if lang=="en" else "Objectifs"}</th><th style="width:25%;">{"Contents" if lang=="en" else "Contenus"}</th><th style="width:25%;">{"Didactic Materials" if lang=="en" else "Matériel Didactique"}</th><th style="width:25%;">{"Activities & Evaluation" if lang=="en" else "Activités & Évaluation"}</th></tr></thead>
                    <tbody>
                        <tr>
                            <td>
                                <ul>
                                    <li>{"Laplace force vector: F = I · (L × B)." if lang=="en" else "Vecteur force de Laplace : F = I · (L × B)."}</li>
                                    <li>{"Intensity formula: F = I · L · B · sin(α) (Newtons)." if lang=="en" else "Intensité : F = I · L · B · sin(α) (N)."}</li>
                                    <li>{"Right-hand rule for Laplace force direction." if lang=="en" else "Règle de la main droite (trois doigts)."}</li>
                                    <li>{"Applications: Laplace rails, DC motor, dynamic loudspeaker." if lang=="en" else "Applications : rails de Laplace, moteur à courant continu, haut-parleur."}</li>
                                    <li>{"Electromechanical energy conversion." if lang=="en" else "Conversion d'énergie électromécanique."}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>I. {"Laplace Force" if lang=="en" else "Force de Laplace"}</strong> (1. {"Experimental setup on rails" if lang=="en" else "Expérience des rails"}, 2. {"Laplace's Law statement" if lang=="en" else "Énoncé de la loi"}, 3. {"Characteristics of F" if lang=="en" else "Caractéristiques de F"})<br>
                                <strong>II. {"Applications" if lang=="en" else "Applications Pratiques"}</strong> (1. {"Electrodynamic loudspeaker" if lang=="en" else "Haut-parleur électrodynamique"}, 2. {"DC electric motor" if lang=="en" else "Moteur électrique à courant continu"})<br>
                                <strong>III. {"Electromechanical Coupling" if lang=="en" else "Couplage Électromécanique"}</strong>
                            </td>
                            <td>
                                <ul>
                                    <li>{"Laplace rails apparatus with rolling copper rod" if lang=="en" else "Dispositif des rails de Laplace avec tige roulante"}</li>
                                    <li>{"Horseshoe magnet, DC high-current power supply" if lang=="en" else "Aimant en U puissant, alimentation continue"}</li>
                                    <li>{"Dismantled loudspeaker model, demonstration DC motor" if lang=="en" else "Modèle démontable de haut-parleur et de moteur"}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>{"Activities:" if lang=="en" else "Activités :"}</strong> {"Demonstrate rolling rod displacement when current flows; reverse current or magnetic field to observe motion reversal. Explain voice coil vibration in loudspeaker." if lang=="en" else "Observation du mouvement de la tige sur les rails de Laplace selon le sens de I et B. Explication du fonctionnement du haut-parleur."}<br>
                                <strong>{"Evaluation:" if lang=="en" else "Évaluation :"}</strong> {"Laplace force calculation problems and Supervised Exam 5." if lang=="en" else "Exercices d'application et Devoir surveillé 5."}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        {render_official_footer(8, lang)}
    </div>
    """
    pages_html.append(p9)

    # ---------------- PAGE 10: OPTICS UNIT 1 ----------------
    p10 = f"""
    <div class="page">
        <div>
            {render_official_header("1BAC Sciences", "Physics Component" if lang=="en" else "Composante Physique", 9, lang)}
            <div class="overview-box">
                <div class="overview-title">{"Part 3: Geometric Optics (14 - 17 Hours)" if lang=="en" else "Partie 3 : L'Optique Géométrique (14 - 17 Heures)"}</div>
                <div class="overview-grid">
                    <div>
                        <strong>{"Competencies:" if lang=="en" else "Compétences Visées :"}</strong>
                        {"Understand image formation in mirrors and lenses. Apply Snell-Descartes laws. Calculate focal lengths and magnifications. Understand optical instruments like magnifying glasses and microscopes." if lang=="en" else "Maîtriser la formation des images par les miroirs et lentilles. Appliquer les lois de Descartes. Calculer vergences et grandissements. Comprendre les instruments d'optique (loupe, microscope)."}
                    </div>
                    <div>
                        <strong>{"Part Units Breakdown:" if lang=="en" else "Unités de la Partie :"}</strong>
                        1. {"Conditions of Visibility of an Object (4h)" if lang=="en" else "Conditions de visibilité d'un objet (4h)"} • 
                        2. {"Images Formed by a Plane Mirror (3-4h)" if lang=="en" else "Images formées par un miroir plan (3-4h)"} • 
                        3. {"Images Formed by a Thin Converging Lens (7-9h)" if lang=="en" else "Images formées par une lentille mince convergente (7-9h)"}
                    </div>
                </div>
            </div>

            <!-- UNIT 1 -->
            <div class="unit-block">
                <div class="unit-banner">
                    <span>{"Unit 1: Conditions of Visibility of an Object" if lang=="en" else "Unité 1 : Conditions de Visibilité d'un Objet"}</span>
                    <span>4 {"Hours" if lang=="en" else "Heures"}</span>
                </div>
                <div class="unit-prereq-problem">
                    <div class="prereq-col">
                        <div class="block-title">{"Prerequisites:" if lang=="en" else "Prérequis :"}</div>
                        {"Light propagation, shadow formation, reflection and refraction." if lang=="en" else "Propagation rectiligne de la lumière, ombres, réflexion et réfraction."}
                    </div>
                    <div class="problem-col">
                        <div class="block-title">{"Problem Situation:" if lang=="en" else "Situation-Problème :"}</div>
                        {"Descartes stated laws of reflection and refraction in 1637. How does light travel, how does the eye see objects, and how are light rays refracted through plexiglass?" if lang=="en" else "Descartes formula les lois de l'optique en 1637. Comment la lumière se propage-t-elle et comment l'œil perçoit-il les objets ?"}
                    </div>
                </div>
                <table class="pedagogical-table">
                    <thead><tr><th style="width:25%;">{"Objectives" if lang=="en" else "Objectifs"}</th><th style="width:25%;">{"Contents" if lang=="en" else "Contenus"}</th><th style="width:25%;">{"Didactic Materials" if lang=="en" else "Matériel Didactique"}</th><th style="width:25%;">{"Activities & Evaluation" if lang=="en" else "Activités & Évaluation"}</th></tr></thead>
                    <tbody>
                        <tr>
                            <td>
                                <ul>
                                    <li>{"Light ray and light beam concepts." if lang=="en" else "Notion de rayon et faisceau lumineux."}</li>
                                    <li>{"Conditions for an object to be seen: emitted/diffused light enters the eye." if lang=="en" else "Conditions de visibilité d'un objet par l'œil."}</li>
                                    <li>{"Snell-Descartes Reflection Law: r = i." if lang=="en" else "Loi de Descartes pour la réflexion : r = i."}</li>
                                    <li>{"Snell-Descartes Refraction Law: n₁ · sin(i₁) = n₂ · sin(i₂)." if lang=="en" else "Loi de Descartes pour la réfraction : n₁·sin(i₁) = n₂·sin(i₂)."}</li>
                                    <li>{"Principle of optical reversibility." if lang=="en" else "Principe du retour inverse de la lumière."}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>I. {"Seeing Objects" if lang=="en" else "Visibilité des Objets"}</strong> (1. {"Luminous object" if lang=="en" else "Objet lumineux"}, 2. {"Two visibility conditions" if lang=="en" else "Conditions de vision"})<br>
                                <strong>II. {"The Eye and Light" if lang=="en" else "L'Œil et la Lumière"}</strong> (1. {"Light ray" if lang=="en" else "Rayon lumineux"}, 2. {"Mechanism of vision" if lang=="en" else "Mécanisme de la vision"})<br>
                                <strong>III. {"Reflection and Refraction" if lang=="en" else "Réflexion et Réfraction"}</strong> (1. {"Reflection law r = i" if lang=="en" else "Lois de la réflexion"}, 2. {"Refraction law n₁ sin(i₁) = n₂ sin(i₂)" if lang=="en" else "Lois de la réfraction"}, 3. {"Optical reversibility" if lang=="en" else "Retour inverse"})
                            </td>
                            <td>
                                <ul>
                                    <li>{"Laser ray box, semicircular plexiglass block" if lang=="en" else "Boîte à rayons laser, demi-cylindre en plexiglas"}</li>
                                    <li>{"Circular graduated optical disc (Hartl disc)" if lang=="en" else "Disque optique gradué de Hartl"}</li>
                                    <li>{"Plane mirrors, white screen, blackout curtains" if lang=="en" else "Miroirs plans, écran blanc, rideaux d'obscurité"}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>{"Activities:" if lang=="en" else "Activités :"}</strong> {"Direct laser beam at semicircular block; record angles i₁ and i₂; verify that sin(i₁) / sin(i₂) is constant and equal to refractive index n." if lang=="en" else "Mesure des angles i₁ et i₂ et vérification expérimentale de la loi n₁·sin(i₁) = n₂·sin(i₂)."}<br>
                                <strong>{"Evaluation:" if lang=="en" else "Évaluation :"}</strong> {"Refraction angle calculations and critical angle problems." if lang=="en" else "Calculs de réfraction et angle limite."}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        {render_official_footer(9, lang)}
    </div>
    """
    pages_html.append(p10)

    # ---------------- PAGE 11: OPTICS UNITS 2 & 3 ----------------
    p11 = f"""
    <div class="page">
        <div>
            {render_official_header("1BAC Sciences", "Physics Component" if lang=="en" else "Composante Physique", 10, lang)}
            
            <!-- UNIT 2 -->
            <div class="unit-block">
                <div class="unit-banner">
                    <span>{"Unit 2: Images Formed by a Plane Mirror" if lang=="en" else "Unité 2 : Images Données par un Miroir Plan"}</span>
                    <span>3 {"Hours" if lang=="en" else "Heures"}</span>
                </div>
                <div class="unit-prereq-problem">
                    <div class="prereq-col">
                        <div class="block-title">{"Prerequisites:" if lang=="en" else "Prérequis :"}</div>
                        {"Reflection of light, Descartes' laws." if lang=="en" else "Réflexion de la lumière, lois de Descartes."}
                    </div>
                    <div class="problem-col">
                        <div class="block-title">{"Problem Situation:" if lang=="en" else "Situation-Problème :"}</div>
                        {"Rearview mirrors are essential for road safety. Does a driver see everything behind them? What are the characteristics of images in a plane mirror?" if lang=="en" else "Les rétroviseurs sont essentiels à la conduite. Le conducteur voit-il tout derrière lui ? Quelles sont les propriétés d'une image dans un miroir plan ?"}
                    </div>
                </div>
                <table class="pedagogical-table">
                    <thead><tr><th style="width:25%;">{"Objectives" if lang=="en" else "Objectifs"}</th><th style="width:25%;">{"Contents" if lang=="en" else "Contenus"}</th><th style="width:25%;">{"Didactic Materials" if lang=="en" else "Matériel Didactique"}</th><th style="width:25%;">{"Activities & Evaluation" if lang=="en" else "Activités & Évaluation"}</th></tr></thead>
                    <tbody>
                        <tr>
                            <td>
                                <ul>
                                    <li>{"Understand plane mirror image: virtual, upright, identical size." if lang=="en" else "Image virtuelle, droite et de même taille."}</li>
                                    <li>{"Image is symmetrical to the object relative to mirror plane." if lang=="en" else "Symétrie de l'image par rapport au plan du miroir."}</li>
                                    <li>{"Determine field of view of a plane mirror." if lang=="en" else "Champ de vision d'un miroir plan."}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>I. {"Plane Mirror Image" if lang=="en" else "Image dans un Miroir"}</strong> (1. {"Definition" if lang=="en" else "Définition"}, 2. {"Symmetry & virtual image" if lang=="en" else "Symétrie et image virtuelle"}, 3. {"Image dimensions" if lang=="en" else "Dimensions"})<br>
                                <strong>II. {"Field of View" if lang=="en" else "Champ de Vision"}</strong> (1. {"Geometric construction" if lang=="en" else "Tracé géométrique"}, 2. {"Applications to rearview mirrors" if lang=="en" else "Rétroviseurs"})
                            </td>
                            <td>
                                <ul>
                                    <li>{"Plane mirror, transparent glass plate, two identical candles" if lang=="en" else "Miroir plan, vitre semi-transparente, 2 bougies identiques"}</li>
                                    <li>{"Ruler, pencil, optical sights" if lang=="en" else "Règle, écran blanc, visées d'optique"}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>{"Activities:" if lang=="en" else "Activités :"}</strong> {"Align two candles on either side of glass plate to prove image position is symmetrical to object." if lang=="en" else "Expérience des deux bougies pour prouver la symétrie de l'image virtuelle."}<br>
                                <strong>{"Evaluation:" if lang=="en" else "Évaluation :"}</strong> {"Ray tracing and field of view construction tests." if lang=="en" else "Tracés de rayons et champ de vision."}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- UNIT 3 -->
            <div class="unit-block">
                <div class="unit-banner">
                    <span>{"Unit 3: Images Formed by a Thin Converging Lens" if lang=="en" else "Unité 3 : Images Données par une Lentille Mince Convergente"}</span>
                    <span>8 {"Hours" if lang=="en" else "Heures"}</span>
                </div>
                <div class="unit-prereq-problem">
                    <div class="prereq-col">
                        <div class="block-title">{"Prerequisites:" if lang=="en" else "Prérequis :"}</div>
                        {"Light rays, refraction, plane mirrors." if lang=="en" else "Rayons lumineux, réfraction, miroirs."}
                    </div>
                    <div class="problem-col">
                        <div class="block-title">{"Problem Situation:" if lang=="en" else "Situation-Problème :"}</div>
                        {"A microscope uses two lenses: the objective creates an enlarged inverted image, and the eyepiece magnifies it. How do thin converging lenses form images?" if lang=="en" else "Le microscope associe deux lentilles pour agrandir un objet. Comment une lentille mince convergente forme-t-elle des images réelles ou virtuelles ?"}
                    </div>
                </div>
                <table class="pedagogical-table">
                    <thead><tr><th style="width:25%;">{"Objectives" if lang=="en" else "Objectifs"}</th><th style="width:25%;">{"Contents" if lang=="en" else "Contenus"}</th><th style="width:25%;">{"Didactic Materials" if lang=="en" else "Matériel Didactique"}</th><th style="width:25%;">{"Activities & Evaluation" if lang=="en" else "Activités & Évaluation"}</th></tr></thead>
                    <tbody>
                        <tr>
                            <td>
                                <ul>
                                    <li>{"Distinguish converging and diverging lenses." if lang=="en" else "Distinguer lentilles convergentes et divergentes."}</li>
                                    <li>{"Optical center O, principal foci F and F', focal length f' = OF'." if lang=="en" else "Centre optique O, foyers F et F', distance focale f'."}</li>
                                    <li>{"Optical power / vergence: C = 1 / f' (dioptries δ)." if lang=="en" else "Vergence C = 1 / f' (dioptries δ)."}</li>
                                    <li>{"Gauss conditions for sharp stigmatic images." if lang=="en" else "Conditions de Gauss (rayons peu inclinés et paraxiaux)."}</li>
                                    <li>{"Descartes conjugation formula: 1/OA' - 1/OA = 1/f'." if lang=="en" else "Formule de conjugaison : 1/OA' - 1/OA = 1/f'."}</li>
                                    <li>{"Linear magnification formula: γ = A'B' / AB = OA' / OA." if lang=="en" else "Grandissement : γ = A'B' / AB = OA' / OA."}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>I. {"Thin Lenses" if lang=="en" else "Lentilles Minces"}</strong> (1. {"Classification" if lang=="en" else "Classification"}, 2. {"Optical center & foci" if lang=="en" else "Centre optique et foyers"}, 3. {"Vergence C = 1/f'" if lang=="en" else "Vergence C = 1/f'"})<br>
                                <strong>II. {"Image Formation" if lang=="en" else "Formation des Images"}</strong> (1. {"Gauss conditions" if lang=="en" else "Conditions de Gauss"}, 2. {"Three characteristic rays" if lang=="en" else "Trois rayons remarquables"}, 3. {"Real vs virtual images" if lang=="en" else "Image réelle et virtuelle"})<br>
                                <strong>III. {"Formulas & Magnification" if lang=="en" else "Relations Fondamentales"}</strong> (1. {"Conjugation formula" if lang=="en" else "Formule de conjugaison"}, 2. {"Magnification γ" if lang=="en" else "Grandissement γ"}, 3. {"Silbermann & autocollimation methods" if lang=="en" else "Méthode d'autocollimation"})
                            </td>
                            <td>
                                <ul>
                                    <li>{"Graduated optical bench with riders" if lang=="en" else "Banc d'optique gradué de 2 m avec cavaliers"}</li>
                                    <li>{"Converging lenses (+5, +10, +20 dioptries)" if lang=="en" else "Jeu de lentilles convergentes (+5, +10, +20 δ)"}</li>
                                    <li>{"Illuminated letter object (F or 1), projection screen, plane mirror" if lang=="en" else "Objet lumineux (lettre F), écran blanc, miroir plan"}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>{"Activities:" if lang=="en" else "Activités :"}</strong> {"Project sharp image on screen; measure OA and OA'; verify 1/OA' - 1/OA = 1/f'. Measure focal length by autocollimation." if lang=="en" else "Mesure de OA et OA' sur banc d'optique ; vérification de la relation de conjugaison ; mesure de f' par autocollimation."}<br>
                                <strong>{"Evaluation:" if lang=="en" else "Évaluation :"}</strong> {"Ray tracing constructions, magnification calculations, and Exam 6." if lang=="en" else "Constructions géométriques de rayons et Devoir surveillé 6."}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        {render_official_footer(10, lang)}
    </div>
    """
    pages_html.append(p11)

    # ---------------- PAGE 12: CHEMISTRY UNIT 1 ----------------
    p12 = f"""
    <div class="page">
        <div>
            {render_official_header("1BAC Sciences", "Chemistry Component" if lang=="en" else "Composante Chimie", 11, lang)}
            <div class="overview-box">
                <div class="overview-title">{"Semester 1: Chemistry • Measurement in Chemistry (Total: 26 Hours)" if lang=="en" else "Semestre 1 : Chimie • La Mesure en Chimie (26 Heures)"}</div>
                <div class="overview-grid">
                    <div>
                        <strong>{"Competencies:" if lang=="en" else "Compétences Visées :"}</strong>
                        {"Master measurement techniques in chemistry. Value environmental protection. Relate physical measurements (conductometry, pressure) to quantities of matter. Carry out direct titrations with precision." if lang=="en" else "Acquérir les techniques de mesure en chimie. Sensibiliser à la protection de l'environnement. Relier mesures physiques et quantités de matière. Réaliser des titrages avec précision."}
                    </div>
                    <div>
                        <strong>{"Semester Units Breakdown:" if lang=="en" else "Unités du Semestre :"}</strong>
                        1. {"Measurement Importance (1h)" if lang=="en" else "Importance de la mesure (1h)"} • 
                        2. {"Mass, Volume, Pressure, Moles (2h)" if lang=="en" else "Masse, volume, pression, mole (2h)"} • 
                        3. {"Concentration & Solutions (2h)" if lang=="en" else "Concentration et solutions (2h)"} • 
                        4. {"Tracking Reactions (3h)" if lang=="en" else "Suivi d'une réaction (3h)"} • 
                        5. {"Conductometry (7h)" if lang=="en" else "Conductimétrie (7h)"} • 
                        6. {"Acid-Base Reactions (3h)" if lang=="en" else "Réactions acide-base (3h)"} • 
                        7. {"Redox Reactions (4h)" if lang=="en" else "Réactions redox (4h)"} • 
                        8. {"Direct Titrations (4h)" if lang=="en" else "Dosages directs (4h)"}
                    </div>
                </div>
            </div>

            <!-- UNIT 1 -->
            <div class="unit-block">
                <div class="unit-banner">
                    <span>{"Unit 1: Importance of Measuring Quantities of Matter in Daily Life" if lang=="en" else "Unité 1 : Importance de la Mesure des Quantités de Matière dans la Vie Quotidienne"}</span>
                    <span>1 {"Hour" if lang=="en" else "Heure"}</span>
                </div>
                <div class="unit-prereq-problem">
                    <div class="prereq-col">
                        <div class="block-title">{"Prerequisites:" if lang=="en" else "Prérequis :"}</div>
                        {"The mole, concentration, health safety, pollution thresholds." if lang=="en" else "La mole, concentration, sécurité sanitaire, normes de pollution."}
                    </div>
                    <div class="problem-col">
                        <div class="block-title">{"Problem Situation:" if lang=="en" else "Situation-Problème :"}</div>
                        {"Measuring substances in medicine, nutrition, and environment is crucial. Why measure in chemistry, and what techniques are employed?" if lang=="en" else "Mesurer les substances dans les médicaments et l'eau est crucial. Pourquoi mesure-t-on en chimie et quelles sont les méthodes utilisées ?"}
                    </div>
                </div>
                <table class="pedagogical-table">
                    <thead><tr><th style="width:25%;">{"Objectives" if lang=="en" else "Objectifs"}</th><th style="width:25%;">{"Contents" if lang=="en" else "Contenus"}</th><th style="width:25%;">{"Didactic Materials" if lang=="en" else "Matériel Didactique"}</th><th style="width:25%;">{"Activities & Evaluation" if lang=="en" else "Activités & Évaluation"}</th></tr></thead>
                    <tbody>
                        <tr>
                            <td>
                                <ul>
                                    <li>{"Understand purpose of chemical measurement (informing, monitoring, intervening)." if lang=="en" else "Rôles de la mesure (informer, surveiller, agir)."}</li>
                                    <li>{"Classify measurement methods: approximate vs precise, continuous vs batch, non-destructive vs destructive." if lang=="en" else "Classification des mesures (précises, continues, destructives)."}</li>
                                    <li>{"Interpret chemical warning labels and safety pictograms." if lang=="en" else "Interpréter les étiquettes et pictogrammes de sécurité."}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>I. {"Why Measure in Chemistry?" if lang=="en" else "Pourquoi Mesurer en Chimie ?"}</strong> (1. {"Informing the consumer" if lang=="en" else "Informer le consommateur"}, 2. {"Quality control & safety" if lang=="en" else "Contrôle qualité et sécurité"}, 3. {"Medical diagnosis & action" if lang=="en" else "Diagnostic médical"})<br>
                                <strong>II. {"How to Measure?" if lang=="en" else "Comment Mesurer ?"}</strong> (1. {"Approximate vs accurate measurements" if lang=="en" else "Mesures approximatives et précises"}, 2. {"Continuous monitoring" if lang=="en" else "Mesures continues"}, 3. {"Non-destructive methods" if lang=="en" else "Mesures non destructives"})
                            </td>
                            <td>
                                <ul>
                                    <li>{"Mineral water bottles, medication packaging labels" if lang=="en" else "Bouteilles d'eau minérale, notices de médicaments"}</li>
                                    <li>{"Blood analysis report samples, chemical safety posters" if lang=="en" else "Analyses sanguines, affiches de sécurité"}</li>
                                    <li>{"Computer projector for environmental air quality data" if lang=="en" else "Vidéoprojecteur et données sur la qualité de l'air"}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>{"Activities:" if lang=="en" else "Activités :"}</strong> {"Analyze mineral water label to inventory dissolved ions (Ca²⁺, Mg²⁺, Cl⁻, SO₄²⁻). Compare with World Health Organization drinking norms." if lang=="en" else "Analyse de l'étiquette d'eau minérale ; comparaison avec les normes de l'OMS."}<br>
                                <strong>{"Evaluation:" if lang=="en" else "Évaluation :"}</strong> {"Label reading and safety pictogram interpretation quiz." if lang=="en" else "Test de lecture d'étiquettes et de sécurité."}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        {render_official_footer(11, lang)}
    </div>
    """
    pages_html.append(p12)

    # ---------------- PAGE 13: CHEMISTRY UNITS 2 & 3 ----------------
    p13 = f"""
    <div class="page">
        <div>
            {render_official_header("1BAC Sciences", "Chemistry Component" if lang=="en" else "Composante Chimie", 12, lang)}
            
            <!-- UNIT 2 -->
            <div class="unit-block">
                <div class="unit-banner">
                    <span>{"Unit 2: Mass, Volume, Pressure and Quantity of Matter" if lang=="en" else "Unité 2 : La Masse, le Volume, la Pression et la Quantité de Matière"}</span>
                    <span>2 {"Hours" if lang=="en" else "Heures"}</span>
                </div>
                <div class="unit-prereq-problem">
                    <div class="prereq-col">
                        <div class="block-title">{"Prerequisites:" if lang=="en" else "Prérequis :"}</div>
                        {"The mole, molar mass, ideal gas law, pressure." if lang=="en" else "La mole, masse molaire, gaz parfaits, pression."}
                    </div>
                    <div class="problem-col">
                        <div class="block-title">{"Problem Situation:" if lang=="en" else "Situation-Problème :"}</div>
                        {"Chemists measure mass, volume, and pressure with balances, pipettes, and manometers. How are these quantities converted into moles?" if lang=="en" else "On mesure facilement la masse et le volume au laboratoire. Comment relier ces grandeurs à la quantité de matière n (en moles) ?"}
                    </div>
                </div>
                <table class="pedagogical-table">
                    <thead><tr><th style="width:25%;">{"Objectives" if lang=="en" else "Objectifs"}</th><th style="width:25%;">{"Contents" if lang=="en" else "Contenus"}</th><th style="width:25%;">{"Didactic Materials" if lang=="en" else "Matériel Didactique"}</th><th style="width:25%;">{"Activities & Evaluation" if lang=="en" else "Activités & Évaluation"}</th></tr></thead>
                    <tbody>
                        <tr>
                            <td>
                                <ul>
                                    <li>{"Solids/liquids: n = m / M = (ρ · V) / M = (d · ρ_eau · V) / M." if lang=="en" else "Solides et liquides : n = m / M = (ρ·V)/M."}</li>
                                    <li>{"Gases: n = V / V_m and P · V = n · R · T (with R = 8.314 J·K⁻¹·mol⁻¹)." if lang=="en" else "Gaz : n = V / V_m et P·V = n·R·T."}</li>
                                    <li>{"Density of gas relative to air: d = M / 29." if lang=="en" else "Densité d'un gaz par rapport à l'air : d = M / 29."}</li>
                                    <li>{"Boyle-Mariotte's law: P · V = const at constant T." if lang=="en" else "Loi de Boyle-Mariotte : P·V = Cte à température constante."}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>I. {"Quantity of Matter & Mass" if lang=="en" else "Quantité de Matière et Masse"}</strong> (1. {"Solids n = m/M" if lang=="en" else "Solides n = m/M"}, 2. {"Pure liquids using density" if lang=="en" else "Liquides et masse volumique"})<br>
                                <strong>II. {"Gases & Gas Laws" if lang=="en" else "Cas des Gaz"}</strong> (1. {"Molar volume V_m" if lang=="en" else "Volume molaire V_m"}, 2. {"Boyle-Mariotte law" if lang=="en" else "Loi de Boyle-Mariotte"}, 3. {"Ideal gas law P·V = n·R·T" if lang=="en" else "Loi des gaz parfaits"})
                            </td>
                            <td>
                                <ul>
                                    <li>{"Precision digital balances, graduated flasks" if lang=="en" else "Balance électronique de précision, fioles"}</li>
                                    <li>{"Syringe connected to pressure sensor / digital manometer" if lang=="en" else "Seringue avec capteur de pression et manomètre"}</li>
                                    <li>{"Flask with magnesium and sulfuric acid (H₂ gas evolution)" if lang=="en" else "Fiole avec magnésium et acide (dégagement H₂)"}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>{"Activities:" if lang=="en" else "Activités :"}</strong> {"Verify Boyle-Mariotte law by compressing air in syringe; plot P vs 1/V. Collect H₂ gas and calculate molar volume." if lang=="en" else "Vérification de la loi de Boyle-Mariotte P·V = Cte. Mesure du volume molaire de H₂ dégagé."}<br>
                                <strong>{"Evaluation:" if lang=="en" else "Évaluation :"}</strong> {"Calculations of n from P, V, T and density." if lang=="en" else "Calculs de n à partir de P, V, T et densité."}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- UNIT 3 -->
            <div class="unit-block">
                <div class="unit-banner">
                    <span>{"Unit 3: Concentration and Electrolytic Solutions" if lang=="en" else "Unité 3 : La Concentration et les Solutions Électrolytiques"}</span>
                    <span>2 {"Hours" if lang=="en" else "Heures"}</span>
                </div>
                <div class="unit-prereq-problem">
                    <div class="prereq-col">
                        <div class="block-title">{"Prerequisites:" if lang=="en" else "Prérequis :"}</div>
                        {"Ionic bonds, polar covalent bonds, dissolution." if lang=="en" else "Liaison ionique, molécule polaire, dissolution."}
                    </div>
                    <div class="problem-col">
                        <div class="block-title">{"Problem Situation:" if lang=="en" else "Situation-Problème :"}</div>
                        {"The ocean is a vast ionic electrolyte solution. What happens when an ionic crystal dissolves in water, and how do we calculate actual ion concentrations?" if lang=="en" else "L'eau de mer est une solution électrolytique géante. Que se passe-t-il lors de la dissolution d'un cristal ionique et comment calculer [X] ?"}
                    </div>
                </div>
                <table class="pedagogical-table">
                    <thead><tr><th style="width:25%;">{"Objectives" if lang=="en" else "Objectifs"}</th><th style="width:25%;">{"Contents" if lang=="en" else "Contenus"}</th><th style="width:25%;">{"Didactic Materials" if lang=="en" else "Matériel Didactique"}</th><th style="width:25%;">{"Activities & Evaluation" if lang=="en" else "Activités & Évaluation"}</th></tr></thead>
                    <tbody>
                        <tr>
                            <td>
                                <ul>
                                    <li>{"Structure of ionic crystals (e.g. NaCl lattice)." if lang=="en" else "Structure des cristaux ioniques (réseau NaCl)."}</li>
                                    <li>{"Polarity of water molecule (permanent dipole)." if lang=="en" else "Polarité de l'eau (dipôle permanent)."}</li>
                                    <li>{"Three stages of dissolution: dissociation, hydration, dispersion." if lang=="en" else "Étapes de dissolution : dissociation, solvatation, dispersion."}</li>
                                    <li>{"Dissolution equation: A_α B_β(s) → α A^(β+) + β B^(α-)." if lang=="en" else "Équation de dissolution : A_α B_β → α A^(β+) + β B^(α-)."}</li>
                                    <li>{"Distinguish solute concentration C and actual ion concentration [X]." if lang=="en" else "Distinction entre concentration apportée C et effective [X]."}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>I. {"Ionic Solids & Polarity" if lang=="en" else "Solides Ioniques & Polarité"}</strong> (1. {"Ionic crystal structure" if lang=="en" else "Cristal ionique"}, 2. {"Polar covalent bond & dipole moment" if lang=="en" else "Liaison polarisée"}, 3. {"Water molecule dipole" if lang=="en" else "Dipôle de l'eau"})<br>
                                <strong>II. {"Aqueous Electrolytic Solutions" if lang=="en" else "Solutions Électrolytiques"}</strong> (1. {"Dissolution mechanism" if lang=="en" else "Mécanisme de dissolution"}, 2. {"Hydrated ions" if lang=="en" else "Ions hydratés"})<br>
                                <strong>III. {"Molar Concentrations" if lang=="en" else "Concentrations Molaires"}</strong> (1. {"Solute concentration C = n/V" if lang=="en" else "Concentration apportée C"}, 2. {"Actual ion concentration [X_i]" if lang=="en" else "Concentration effective [X_i]"})
                            </td>
                            <td>
                                <ul>
                                    <li>{"Sodium chloride NaCl, copper sulfate CuSO₄, sugar" if lang=="en" else "Chlorure de sodium NaCl, sulfate de cuivre, sucre"}</li>
                                    <li>{"Silver nitrate solution AgNO₃, barium chloride BaCl₂" if lang=="en" else "Nitrate d'argent, chlorure de baryum"}</li>
                                    <li>{"Conductivity tester with light bulb, beakers, magnetic stirrer" if lang=="en" else "Détecteur de conduction à lampe, agitateur"}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>{"Activities:" if lang=="en" else "Activités :"}</strong> {"Test electrical conductivity of distilled water, solid NaCl, and salt water. Calculate [Fe³⁺] and [SO₄²⁻] in 0.1 mol/L Fe₂(SO₄)₃ solution." if lang=="en" else "Test de conduction de l'eau salée vs eau pure. Calcul des concentrations effectives en ions."}<br>
                                <strong>{"Evaluation:" if lang=="en" else "Évaluation :"}</strong> {"Dissolution equations and ion concentration calculations." if lang=="en" else "Équations de dissolution et calculs de [X]."}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        {render_official_footer(12, lang)}
    </div>
    """
    pages_html.append(p13)

    # ---------------- PAGE 14: CHEMISTRY UNITS 4 & 5 ----------------
    p14 = f"""
    <div class="page">
        <div>
            {render_official_header("1BAC Sciences", "Chemistry Component" if lang=="en" else "Composante Chimie", 13, lang)}
            
            <!-- UNIT 4 -->
            <div class="unit-block">
                <div class="unit-banner">
                    <span>{"Unit 4: Tracking the Evolution of a Chemical Transformation" if lang=="en" else "Unité 4 : Suivi de l'Évolution d'une Transformation Chimique"}</span>
                    <span>3 {"Hours" if lang=="en" else "Heures"}</span>
                </div>
                <div class="unit-prereq-problem">
                    <div class="prereq-col">
                        <div class="block-title">{"Prerequisites:" if lang=="en" else "Prérequis :"}</div>
                        {"The mole, balanced chemical equations, stoichiometry." if lang=="en" else "La mole, équation chimique équilibrée, stœchiométrie."}
                    </div>
                    <div class="problem-col">
                        <div class="block-title">{"Problem Situation:" if lang=="en" else "Situation-Problème :"}</div>
                        {"During a reaction, reactants vanish as products accumulate. How is reaction progress x defined, and how do we predict final pressure or gas volume?" if lang=="en" else "Lors d'une réaction, les réactifs se consument et les produits se forment. Comment quantifier l'évolution par l'avancement x ?"}
                    </div>
                </div>
                <table class="pedagogical-table">
                    <thead><tr><th style="width:25%;">{"Objectives" if lang=="en" else "Objectifs"}</th><th style="width:25%;">{"Contents" if lang=="en" else "Contenus"}</th><th style="width:25%;">{"Didactic Materials" if lang=="en" else "Matériel Didactique"}</th><th style="width:25%;">{"Activities & Evaluation" if lang=="en" else "Activités & Évaluation"}</th></tr></thead>
                    <tbody>
                        <tr>
                            <td>
                                <ul>
                                    <li>{"Model transformation with balanced equation." if lang=="en" else "Modéliser par une équation équilibrée."}</li>
                                    <li>{"Reaction progress x in moles." if lang=="en" else "Avancement de réaction x en moles."}</li>
                                    <li>{"Construct ICE progress table." if lang=="en" else "Dresser le tableau d'avancement."}</li>
                                    <li>{"Identify limiting reactant and maximum progress x_max." if lang=="en" else "Identifier le réactif limitant et x_max."}</li>
                                    <li>{"Predict final gas volume V_f and pressure P_f." if lang=="en" else "Prédire le volume et la pression finale de gaz."}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>I. {"Chemical Transformation" if lang=="en" else "Transformation Chimique"}</strong> (1. {"Initial state & final state" if lang=="en" else "États initial et final"}, 2. {"Reaction equation" if lang=="en" else "Équation de réaction"})<br>
                                <strong>II. {"Progress of Reaction" if lang=="en" else "Avancement de la Réaction"}</strong> (1. {"Definition of x" if lang=="en" else "Notion d'avancement x"}, 2. {"ICE progress table" if lang=="en" else "Tableau d'avancement"})<br>
                                <strong>III. {"Final Matter Balance" if lang=="en" else "Bilan de Matière Final"}</strong> (1. {"Limiting reactant" if lang=="en" else "Réactif limitant"}, 2. {"Maximum progress x_max" if lang=="en" else "Avancement maximal x_max"}, 3. {"Gas evolution" if lang=="en" else "Gaz dégagé"})
                            </td>
                            <td>
                                <ul>
                                    <li>{"Zinc powder, hydrochloric acid solution" if lang=="en" else "Poudre de zinc, acide chlorhydrique"}</li>
                                    <li>{"Sealed gas generation flask, gas syringe" if lang=="en" else "Fiole étanche, seringue à gaz graduée"}</li>
                                    <li>{"Precipitation solutions: AgNO₃, NaCl, NaOH, CuSO₄" if lang=="en" else "Solutions de précipitation : AgNO₃, NaCl, CuSO₄, NaOH"}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>{"Activities:" if lang=="en" else "Activités :"}</strong> {"React known mass of Zn with excess HCl; measure H₂ gas volume; compare experimental volume with x_max · V_m." if lang=="en" else "Réaction de Zn avec HCl ; mesure du volume de H₂ et confrontation avec x_max·V_m."}<br>
                                <strong>{"Evaluation:" if lang=="en" else "Évaluation :"}</strong> {"ICE table construction and limiting reactant exercises." if lang=="en" else "Exercices de tableau d'avancement et bilan final."}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- UNIT 5 -->
            <div class="unit-block">
                <div class="unit-banner">
                    <span>{"Unit 5: Determining Quantity of Matter by Physical Measurement: Conductometry" if lang=="en" else "Unité 5 : Détermination de la Quantité de Matière par Mesure Physique : Conductimétrie"}</span>
                    <span>7 {"Hours" if lang=="en" else "Heures"}</span>
                </div>
                <div class="unit-prereq-problem">
                    <div class="prereq-col">
                        <div class="block-title">{"Prerequisites:" if lang=="en" else "Prérequis :"}</div>
                        {"Ohm's law, AC current, ionic concentrations, conductance." if lang=="en" else "Loi d'Ohm, courant alternatif, concentrations ioniques, conductance."}
                    </div>
                    <div class="problem-col">
                        <div class="block-title">{"Problem Situation:" if lang=="en" else "Situation-Problème :"}</div>
                        {"Environmental monitors check river and seawater purity using conductivity meters. What is conductivity, and how is Kohlrausch's law applied?" if lang=="en" else "Les capteurs environnementaux surveillent la pureté des eaux par la conductivité. Qu'est-ce que la conductivité et comment appliquer la loi de Kohlrausch ?"}
                    </div>
                </div>
                <table class="pedagogical-table">
                    <thead><tr><th style="width:25%;">{"Objectives" if lang=="en" else "Objectifs"}</th><th style="width:25%;">{"Contents" if lang=="en" else "Contenus"}</th><th style="width:25%;">{"Didactic Materials" if lang=="en" else "Matériel Didactique"}</th><th style="width:25%;">{"Activities & Evaluation" if lang=="en" else "Activités & Évaluation"}</th></tr></thead>
                    <tbody>
                        <tr>
                            <td>
                                <ul>
                                    <li>{"Conductance G = 1/R = I/U (Siemens S)." if lang=="en" else "Conductance G = 1/R = I/U (Siemens S)."}</li>
                                    <li>{"Cell constant: K_cell = S / l (m); relation G = σ · K_cell." if lang=="en" else "Constante de cellule K = S / l (m) ; G = σ·K."}</li>
                                    <li>{"Conductivity σ (S/m) of dilute electrolytic solution." if lang=="en" else "Conductivité σ (S/m) de la solution."}</li>
                                    <li>{"Kohlrausch's Law: σ = Σ λ_i · [X_i] (where [X_i] in mol/m³)." if lang=="en" else "Loi de Kohlrausch : σ = Σ λ_i · [X_i] (avec [X] en mol/m³)."}</li>
                                    <li>{"Conductometric calibration curve: G = f(C) or σ = f(C)." if lang=="en" else "Courbe d'étalonnage conductimétrique σ = f(C)."}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>I. {"Conductance of Electrolytes" if lang=="en" else "Conductance"}</strong> (1. {"Resistance & conductance G = I/U" if lang=="en" else "Conductance G = I/U"}, 2. {"Cell geometry factors" if lang=="en" else "Facteurs géométriques"}, 3. {"Solution factors" if lang=="en" else "Facteurs liés à la solution"})<br>
                                <strong>II. {"Conductivity" if lang=="en" else "Conductivité"}</strong> (1. {"Definition σ = G · (l/S)" if lang=="en" else "Définition σ = G·(l/S)"}, 2. {"Molar ionic conductivities λ_i" if lang=="en" else "Conductivités molaires ioniques λ_i"}, 3. {"Kohlrausch's law" if lang=="en" else "Loi de Kohlrausch"})<br>
                                <strong>III. {"Calibration Curve" if lang=="en" else "Dosage par Étalonnage"}</strong> (1. {"Standard series" if lang=="en" else "Gamme étalon"}, 2. {"Finding unknown concentration" if lang=="en" else "Détermination de C inconnue"})
                            </td>
                            <td>
                                <ul>
                                    <li>{"Digital conductometer with cell (parallel platinum plates)" if lang=="en" else "Conductimètre numérique avec cellule à plaques de platine"}</li>
                                    <li>{"Standard KCl solutions (0.01, 0.05, 0.1 mol/L)" if lang=="en" else "Solutions étalons de KCl de diverses concentrations"}</li>
                                    <li>{"NaCl solutions of varied concentrations, unknown saline solution" if lang=="en" else "Gamme de solutions de NaCl, solution inconnue"}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>{"Activities:" if lang=="en" else "Activités :"}</strong> {"Measure conductance G of standard NaCl series; plot G vs C calibration line; deduce concentration of unknown saline solution." if lang=="en" else "Mesure de G pour la gamme étalon ; tracé de G = f(C) et détermination de la concentration d'une solution inconnue."}<br>
                                <strong>{"Evaluation:" if lang=="en" else "Évaluation :"}</strong> {"Kohlrausch calculations (converting mol/L to mol/m³) and Exam 2." if lang=="en" else "Calculs de Kohlrausch et Devoir surveillé 2."}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        {render_official_footer(13, lang)}
    </div>
    """
    pages_html.append(p14)

    # ---------------- PAGE 15: CHEMISTRY UNIT 6 ----------------
    p15 = f"""
    <div class="page">
        <div>
            {render_official_header("1BAC Sciences", "Chemistry Component" if lang=="en" else "Composante Chimie", 14, lang)}
            
            <!-- UNIT 6 -->
            <div class="unit-block">
                <div class="unit-banner">
                    <span>{"Unit 6: Acid-Base Reactions" if lang=="en" else "Unité 6 : Les Réactions Acide - Base"}</span>
                    <span>3 {"Hours" if lang=="en" else "Heures"}</span>
                </div>
                <div class="unit-prereq-problem">
                    <div class="prereq-col">
                        <div class="block-title">{"Prerequisites:" if lang=="en" else "Prérequis :"}</div>
                        {"pH concept, acidic and basic solutions, ions in water." if lang=="en" else "Notion de pH, solutions acides et basiques, ions dans l'eau."}
                    </div>
                    <div class="problem-col">
                        <div class="block-title">{"Problem Situation:" if lang=="en" else "Situation-Problème :"}</div>
                        {"Cyanidin dyes poppy flowers red in acid and cornflowers blue in base. What defines an acid and a base according to Brønsted, and what is an acid-base reaction?" if lang=="en" else "La cyanidine colore le coquelicot en rouge et le bleuet en bleu selon l'acidité. Qu'est-ce qu'un acide et une base selon Brønsted ?"}
                    </div>
                </div>
                <table class="pedagogical-table">
                    <thead><tr><th style="width:25%;">{"Objectives" if lang=="en" else "Objectifs"}</th><th style="width:25%;">{"Contents" if lang=="en" else "Contenus"}</th><th style="width:25%;">{"Didactic Materials" if lang=="en" else "Matériel Didactique"}</th><th style="width:25%;">{"Activities & Evaluation" if lang=="en" else "Activités & Évaluation"}</th></tr></thead>
                    <tbody>
                        <tr>
                            <td>
                                <ul>
                                    <li>{"Brønsted-Lowry definition of acid (H⁺ donor) and base (H⁺ acceptor)." if lang=="en" else "Définitions de Brønsted : acide (donneur H⁺) et base (accepteur H⁺)."}</li>
                                    <li>{"Conjugate acid-base couple HA / A⁻." if lang=="en" else "Couple acide-base conjugué HA / A⁻."}</li>
                                    <li>{"Proton exchange half-reaction: HA ⇌ A⁻ + H⁺." if lang=="en" else "Demi-équation protonique : HA ⇌ A⁻ + H⁺."}</li>
                                    <li>{"Amphoteric species (ampholyte): water H₃O⁺/H₂O and H₂O/HO⁻." if lang=="en" else "Espèce amphotère : l'eau H₃O⁺/H₂O et H₂O/HO⁻."}</li>
                                    <li>{"Balanced acid-base equation: HA₁ + A₂⁻ ⇌ A₁⁻ + HA₂." if lang=="en" else "Équation bilan de la réaction acide-base."}</li>
                                    <li>{"Colored indicators as acid-base couples (HIn / In⁻)." if lang=="en" else "Indicateurs colorés acido-basiques (HIn / In⁻)."}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>I. {"Brønsted Acid-Base Theory" if lang=="en" else "Théorie de Brønsted"}</strong> (1. {"Acid definition (proton donor)" if lang=="en" else "Acide (donneur de proton)"}, 2. {"Base definition (proton acceptor)" if lang=="en" else "Base (accepteur de proton)"})<br>
                                <strong>II. {"Conjugate Couples" if lang=="en" else "Couples Acide-Base"}</strong> (1. {"Proton half-equation" if lang=="en" else "Demi-équation protonique"}, 2. {"Ampholytes & water couples" if lang=="en" else "Ampholytes et couples de l'eau"}, 3. {"Common couples (CH₃COOH/CH₃COO⁻, NH₄⁺/NH₃)" if lang=="en" else "Couples usuels"})<br>
                                <strong>III. {"Acid-Base Reaction & Indicators" if lang=="en" else "Réactions & Indicateurs"}</strong> (1. {"Proton transfer reaction" if lang=="en" else "Transfert de proton"}, 2. {"Colored indicators" if lang=="en" else "Indicateurs colorés"})
                            </td>
                            <td>
                                <ul>
                                    <li>{"Ethanoic acid CH₃COOH, hydrochloric acid HCl, sodium hydroxide NaOH" if lang=="en" else "Acide éthanoïque, acide chlorhydrique, soude NaOH"}</li>
                                    <li>{"Ammonia solution NH₃, ammonium chloride NH₄Cl" if lang=="en" else "Ammoniaque, chlorure d'ammonium"}</li>
                                    <li>{"Bromothymol blue (BBT), methyl orange, phenolphthalein" if lang=="en" else "Bleu de bromothymol (BBT), hélianthine, phénolphtaléine"}</li>
                                    <li>{"pH paper, test tubes, dropper pipettes" if lang=="en" else "Papier pH, tubes à essais, pipettes"}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>{"Activities:" if lang=="en" else "Activités :"}</strong> {"Test color of BBT in acidic, neutral, and basic media. Write half-equations and combine for CH₃COOH + NaOH and NH₄⁺ + HO⁻." if lang=="en" else "Observation du virage du BBT en milieu acide et basique. Écriture des demi-équations et de l'équation bilan."}<br>
                                <strong>{"Evaluation:" if lang=="en" else "Évaluation :"}</strong> {"Writing balanced acid-base reactions and conjugate couples tests." if lang=="en" else "Exercices d'équilibrage acido-basique et Devoir 3."}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        {render_official_footer(14, lang)}
    </div>
    """
    pages_html.append(p15)

    # ---------------- PAGE 16: CHEMISTRY UNITS 7 & 8 ----------------
    p16 = f"""
    <div class="page">
        <div>
            {render_official_header("1BAC Sciences", "Chemistry Component" if lang=="en" else "Composante Chimie", 15, lang)}
            <div class="overview-box">
                <div class="overview-title">{"Semester 2: Chemistry • Redox Transformations and Direct Titrations (8 Hours)" if lang=="en" else "Semestre 2 : Chimie • Oxydoréduction et Dosages Directs (8 Heures)"}</div>
            </div>

            <!-- UNIT 7 -->
            <div class="unit-block">
                <div class="unit-banner">
                    <span>{"Unit 7: Oxidation-Reduction Reactions" if lang=="en" else "Unité 7 : Les Réactions d'Oxydoréduction"}</span>
                    <span>4 {"Hours" if lang=="en" else "Heures"}</span>
                </div>
                <div class="unit-prereq-problem">
                    <div class="prereq-col">
                        <div class="block-title">{"Prerequisites:" if lang=="en" else "Prérequis :"}</div>
                        {"Atoms, ions, valence electrons, metals." if lang=="en" else "Atomes, ions, électrons de valence, métaux."}
                    </div>
                    <div class="problem-col">
                        <div class="block-title">{"Problem Situation:" if lang=="en" else "Situation-Problème :"}</div>
                        {"Iron rusts when exposed to moist air in an oxidation-reduction reaction. What is an oxidant and a reductant? What governs electron transfer in redox reactions?" if lang=="en" else "Le fer rouille à l'air humide par oxydoréduction. Qu'est-ce qu'un oxydant et un réducteur ? Comment s'équilibrent les transferts d'électrons ?"}
                    </div>
                </div>
                <table class="pedagogical-table">
                    <thead><tr><th style="width:25%;">{"Objectives" if lang=="en" else "Objectifs"}</th><th style="width:25%;">{"Contents" if lang=="en" else "Contenus"}</th><th style="width:25%;">{"Didactic Materials" if lang=="en" else "Matériel Didactique"}</th><th style="width:25%;">{"Activities & Evaluation" if lang=="en" else "Activités & Évaluation"}</th></tr></thead>
                    <tbody>
                        <tr>
                            <td>
                                <ul>
                                    <li>{"Oxidant: species that gains electrons (reduction)." if lang=="en" else "Oxydant : espèce qui capte des électrons (réduction)."}</li>
                                    <li>{"Reductant: species that loses electrons (oxidation)." if lang=="en" else "Réducteur : espèce qui cède des électrons (oxydation)."}</li>
                                    <li>{"Redox couple Ox / Red and electronic half-equation: Ox + n e⁻ ⇌ Red." if lang=="en" else "Couple Ox / Red et demi-équation : Ox + n e⁻ ⇌ Red."}</li>
                                    <li>{"Balance complex redox equations in acidic media (H⁺ and H₂O)." if lang=="en" else "Équilibrer les demi-équations complexes en milieu acide."}</li>
                                    <li>{"Everyday redox applications (batteries, corrosion, bleaching)." if lang=="en" else "Applications quotidiennes (corrosion, piles, eau de Javel)."}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>I. {"Redox Concepts" if lang=="en" else "Notions d'Oxydoréduction"}</strong> (1. {"Oxidation & reduction" if lang=="en" else "Oxydation et réduction"}, 2. {"Electron transfer" if lang=="en" else "Transfert d'électrons"})<br>
                                <strong>II. {"Ox/Red Couples" if lang=="en" else "Couples Oxydant / Réducteur"}</strong> (1. {"Definition" if lang=="en" else "Définition"}, 2. {"Electronic half-equation" if lang=="en" else "Demi-équation électronique"}, 3. {"Common couples (Cu²⁺/Cu, Fe³⁺/Fe²⁺, MnO₄⁻/Mn²⁺, I₂/I⁻)" if lang=="en" else "Couples usuels"})<br>
                                <strong>III. {"Balanced Redox Equation" if lang=="en" else "Équation Bilan d'Oxydoréduction"}</strong>
                            </td>
                            <td>
                                <ul>
                                    <li>{"Copper turnings, zinc granules, iron filings" if lang=="en" else "Tournure de cuivre, grenaille de zinc, fer"}</li>
                                    <li>{"Copper sulfate solution CuSO₄, silver nitrate AgNO₃" if lang=="en" else "Sulfate de cuivre, nitrate d'argent"}</li>
                                    <li>{"Acidified potassium permanganate KMnO₄, iron(II) sulfate FeSO₄" if lang=="en" else "Permanganate de potassium acidifié, sulfate de fer(II)"}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>{"Activities:" if lang=="en" else "Activités :"}</strong> {"Immerse zinc rod in copper sulfate; observe copper deposition and solution discoloration. Balance reaction between MnO₄⁻ and Fe²⁺ in acid." if lang=="en" else "Action du zinc sur CuSO₄ ; observation du dépôt de cuivre ; équilibrage de la réaction entre MnO₄⁻ et Fe²⁺."}<br>
                                <strong>{"Evaluation:" if lang=="en" else "Évaluation :"}</strong> {"Balancing complex redox equations in acidic medium." if lang=="en" else "Exercices d'équilibrage de demi-équations complexes."}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- UNIT 8 -->
            <div class="unit-block">
                <div class="unit-banner">
                    <span>{"Unit 8: Direct Titrations" if lang=="en" else "Unité 8 : Les Dosages Directs"}</span>
                    <span>4 {"Hours" if lang=="en" else "Heures"}</span>
                </div>
                <div class="unit-prereq-problem">
                    <div class="prereq-col">
                        <div class="block-title">{"Prerequisites:" if lang=="en" else "Prérequis :"}</div>
                        {"Acid-base reactions, redox reactions, stoichiometric ratios, burette." if lang=="en" else "Réactions acido-basiques, réactions redox, stœchiométrie, burette."}
                    </div>
                    <div class="problem-col">
                        <div class="block-title">{"Problem Situation:" if lang=="en" else "Situation-Problème :"}</div>
                        {"To verify water quality or drug purity, chemists perform titrations. What is the equivalence point, and how is unknown concentration calculated?" if lang=="en" else "Pour doser un principe actif ou vérifier la qualité d'une eau, le chimiste réalise un titrage. Comment repérer l'équivalence et calculer C ?"}
                    </div>
                </div>
                <table class="pedagogical-table">
                    <thead><tr><th style="width:25%;">{"Objectives" if lang=="en" else "Objectifs"}</th><th style="width:25%;">{"Contents" if lang=="en" else "Contenus"}</th><th style="width:25%;">{"Didactic Materials" if lang=="en" else "Matériel Didactique"}</th><th style="width:25%;">{"Activities & Evaluation" if lang=="en" else "Activités & Évaluation"}</th></tr></thead>
                    <tbody>
                        <tr>
                            <td>
                                <ul>
                                    <li>{"Principle of titration: rapid, total, unique reaction." if lang=="en" else "Principe du dosage : réaction rapide, totale et univoque."}</li>
                                    <li>{"Equivalence definition: reactants mixed in stoichiometric ratio." if lang=="en" else "Équivalence : réactifs en proportions stœchiométriques."}</li>
                                    <li>{"Equivalence formula: n_A / a = n_B / b ⇒ C_A · V_A / a = C_B · V_BE / b." if lang=="en" else "Relation à l'équivalence : C_A · V_A / a = C_B · V_BE / b."}</li>
                                    <li>{"Colorimetric titration (sudden color change at equivalence)." if lang=="en" else "Dosage colorimétrique (changement brusque de teinte)."}</li>
                                    <li>{"Conductometric titration (slope change of conductivity curve)." if lang=="en" else "Dosage conductimétrique (changement de pente)."}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>I. {"Principle of Titration" if lang=="en" else "Principe du Dosage"}</strong> (1. {"Titrated and titrant species" if lang=="en" else "Espèce titrée et titrante"}, 2. {"Equivalence state" if lang=="en" else "État d'équivalence"})<br>
                                <strong>II. {"Titration Methods" if lang=="en" else "Méthodes de Dosage"}</strong> (1. {"Colorimetric titration" if lang=="en" else "Dosage colorimétrique"}, 2. {"Conductometric titration" if lang=="en" else "Dosage conductimétrique"})<br>
                                <strong>III. {"Equivalence Equation & Precision" if lang=="en" else "Calculs à l'Équivalence & Précision"}</strong>
                            </td>
                            <td>
                                <ul>
                                    <li>{"Graduated precision burette (25 mL), volumetric pipette (10 mL)" if lang=="en" else "Burette graduée de précision (25 mL), pipette jaugée"}</li>
                                    <li>{"Magnetic stirrer, Erlenmeyer flasks, conductometer with probe" if lang=="en" else "Agitateur magnétique, béchers, conductimètre"}</li>
                                    <li>{"Solutions: KMnO₄ (known C), Fe²⁺ (unknown C), H₂SO₄, BBT indicator" if lang=="en" else "Solutions : KMnO₄ étalon, Fe²⁺ à doser, acide sulfurique, BBT"}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>{"Activities:" if lang=="en" else "Activités :"}</strong> {"Titrate iron(II) with purple KMnO₄; observe persistent pink color at equivalence volume V_E; calculate unknown concentration C_Fe." if lang=="en" else "Dosage des ions fer(II) par le permanganate ; repérage du volume équivalent V_E à la persistance du rose ; calcul de C."}<br>
                                <strong>{"Evaluation:" if lang=="en" else "Évaluation :"}</strong> {"Stoichiometric equivalence calculations and Supervised Exam 4." if lang=="en" else "Calculs à l'équivalence et Devoir surveillé 4."}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        {render_official_footer(15, lang)}
    </div>
    """
    pages_html.append(p16)

    # ---------------- PAGE 17: ORGANIC CHEMISTRY UNITS 1 & 2 ----------------
    p17 = f"""
    <div class="page">
        <div>
            {render_official_header("1BAC Sciences", "Chemistry Component" if lang=="en" else "Composante Chimie", 16, lang)}
            <div class="overview-box">
                <div class="overview-title">{"Semester 2: Chemistry • Organic Chemistry (Total: 15 Hours)" if lang=="en" else "Semestre 2 : Chimie • La Chimie Organique (15 Heures)"}</div>
                <div class="overview-grid">
                    <div>
                        <strong>{"Competencies:" if lang=="en" else "Compétences Visées :"}</strong>
                        {"Synthesize organic compounds. Apply IUPAC systematic nomenclature. Represent 3D molecular structures. Understand industrial cracking, reforming, and functional groups." if lang=="en" else "Réaliser des synthèses organiques. Appliquer la nomenclature systématique IUPAC. Représenter la géométrie spatiale des molécules. Maîtriser le raffinage et les groupes fonctionnels."}
                    </div>
                    <div>
                        <strong>{"Part Units Breakdown:" if lang=="en" else "Unités de la Partie :"}</strong>
                        1. {"Expansion of Organic Chemistry (2h)" if lang=="en" else "Expansion de la chimie organique (2h)"} • 
                        2. {"Organic Molecules & Carbon Skeletons (5h)" if lang=="en" else "Molécules organiques et squelettes carbonés (5h)"} • 
                        3. {"Modifying the Carbon Skeleton (3h)" if lang=="en" else "Modification du squelette carboné (3h)"} • 
                        4. {"Functional Groups - Alcohols Reactivity (5h)" if lang=="en" else "Groupes caractéristiques - Réactivité des alcools (5h)"}
                    </div>
                </div>
            </div>

            <!-- UNIT 1 -->
            <div class="unit-block">
                <div class="unit-banner">
                    <span>{"Unit 1: Expansion and Horizons of Organic Chemistry" if lang=="en" else "Unité 1 : Expansion de la Chimie Organique"}</span>
                    <span>2 {"Hours" if lang=="en" else "Heures"}</span>
                </div>
                <div class="unit-prereq-problem">
                    <div class="prereq-col">
                        <div class="block-title">{"Prerequisites:" if lang=="en" else "Prérequis :"}</div>
                        {"Covalent bonds, Lewis model, carbon element." if lang=="en" else "Liaisons covalentes, modèle de Lewis, élément carbone."}
                    </div>
                    <div class="problem-col">
                        <div class="block-title">{"Problem Situation:" if lang=="en" else "Situation-Problème :"}</div>
                        {"Petroleum provides raw materials for millions of organic compounds. What is organic chemistry, and why is carbon unique in building complex chains?" if lang=="en" else "Le pétrole fournit les matières premières de millions de composés. Qu'est-ce que la chimie organique et pourquoi le carbone est-il unique ?"}
                    </div>
                </div>
                <table class="pedagogical-table">
                    <thead><tr><th style="width:25%;">{"Objectives" if lang=="en" else "Objectifs"}</th><th style="width:25%;">{"Contents" if lang=="en" else "Contenus"}</th><th style="width:25%;">{"Didactic Materials" if lang=="en" else "Matériel Didactique"}</th><th style="width:25%;">{"Activities & Evaluation" if lang=="en" else "Activités & Évaluation"}</th></tr></thead>
                    <tbody>
                        <tr>
                            <td>
                                <ul>
                                    <li>{"Historical milestones of organic chemistry (Wöhler synthesis 1828)." if lang=="en" else "Histoire de la chimie organique (synthèse de l'urée de Wöhler)."}</li>
                                    <li>{"Carbon atom tetravalence (4 covalent bonds)." if lang=="en" else "Tétravalence du carbone (4 liaisons covalentes)."}</li>
                                    <li>{"Natural sources: petroleum, natural gas, biomass, photosynthesis." if lang=="en" else "Sources naturelles : pétrole, gaz naturel, biomasse."}</li>
                                    <li>{"Importance of synthetic chemistry in medicine, plastics, fibers." if lang=="en" else "Importance dans la santé, textiles, matières plastiques."}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>I. {"Organic Chemistry Overview" if lang=="en" else "Présentation"}</strong> (1. {"Definition & carbon role" if lang=="en" else "Définition & rôle du carbone"}, 2. {"Natural sources" if lang=="en" else "Sources naturelles"})<br>
                                <strong>II. {"Carbon Atom Properties" if lang=="en" else "Le Carbone"}</strong> (1. {"Tetravalence" if lang=="en" else "Tétravalence"}, 2. {"Single, double, and triple bonds" if lang=="en" else "Liaisons simples, doubles et triples"})<br>
                                <strong>III. {"Societal Impact" if lang=="en" else "Impact Industriel"}</strong>
                            </td>
                            <td>
                                <ul>
                                    <li>{"Textbook, molecular model kits, video clips on refining" if lang=="en" else "Manuel, modèles moléculaires, documentaires sur le raffinage"}</li>
                                    <li>{"Samples of plastics (PE, PVC, PS) and synthetic fibers" if lang=="en" else "Échantillons de plastiques (PE, PVC, PS) et fibres"}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>{"Activities:" if lang=="en" else "Activités :"}</strong> {"Student presentations on history of organic synthesis and petroleum refining fractions." if lang=="en" else "Exposés sur l'histoire de la chimie organique et les coupes pétrolières."}<br>
                                <strong>{"Evaluation:" if lang=="en" else "Évaluation :"}</strong> {"Oral questions on carbon bonding and natural sources." if lang=="en" else "Questions orales et contrôles de connaissances."}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- UNIT 2 -->
            <div class="unit-block">
                <div class="unit-banner">
                    <span>{"Unit 2: Organic Molecules and Carbon Skeletons" if lang=="en" else "Unité 2 : Les Molécules Organiques et les Squelettes Carbonés"}</span>
                    <span>5 {"Hours" if lang=="en" else "Heures"}</span>
                </div>
                <div class="unit-prereq-problem">
                    <div class="prereq-col">
                        <div class="block-title">{"Prerequisites:" if lang=="en" else "Prérequis :"}</div>
                        {"Carbon tetravalence, molecular formulas, structural formulas." if lang=="en" else "Tétravalence du carbone, formules brutes et semi-développées."}
                    </div>
                    <div class="problem-col">
                        <div class="block-title">{"Problem Situation:" if lang=="en" else "Situation-Problème :"}</div>
                        {"Chlorophyll and fuels have complex carbon chains. What are the types of carbon chains, and how are alkanes and alkenes systematically named?" if lang=="en" else "Les hydrocarbures possèdent des chaînes carbonées variées. Quels sont les types de chaînes et comment nommer alcanes et alcènes selon l'IUPAC ?"}
                    </div>
                </div>
                <table class="pedagogical-table">
                    <thead><tr><th style="width:25%;">{"Objectives" if lang=="en" else "Objectifs"}</th><th style="width:25%;">{"Contents" if lang=="en" else "Contenus"}</th><th style="width:25%;">{"Didactic Materials" if lang=="en" else "Matériel Didactique"}</th><th style="width:25%;">{"Activities & Evaluation" if lang=="en" else "Activités & Évaluation"}</th></tr></thead>
                    <tbody>
                        <tr>
                            <td>
                                <ul>
                                    <li>{"Saturated vs unsaturated carbon chains." if lang=="en" else "Chaînes saturées et insaturées."}</li>
                                    <li>{"Straight, branched, and cyclic carbon skeletons." if lang=="en" else "Chaînes linéaires, ramifiées et cycliques."}</li>
                                    <li>{"Skeletal/topological formulas of organic molecules." if lang=="en" else "Formule topologique des molécules organiques."}</li>
                                    <li>{"Alkanes (C_n H_(2n+2)) and IUPAC nomenclature rules." if lang=="en" else "Alcanes (C_n H_(2n+2)) et nomenclature systématique IUPAC."}</li>
                                    <li>{"Alkenes (C_n H_2n) and stereoisomerism (Z / E)." if lang=="en" else "Alcènes (C_n H_2n) et stéréoisomérie (Z / E)."}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>I. {"Carbon Chains Diversity" if lang=="en" else "Diversité des Chaînes"}</strong> (1. {"Saturated & unsaturated" if lang=="en" else "Saturées et insaturées"}, 2. {"Linear, branched, cyclic" if lang=="en" else "Linéaires, ramifiées, cycliques"}, 3. {"Topological formula" if lang=="en" else "Écriture topologique"})<br>
                                <strong>II. {"Alkanes & Nomenclature" if lang=="en" else "Les Alcanes"}</strong> (1. {"General formula" if lang=="en" else "Formule générale"}, 2. {"Alkyl groups" if lang=="en" else "Groupes alkyles"}, 3. {"Naming branched alkanes" if lang=="en" else "Règles de nomenclature IUPAC"})<br>
                                <strong>III. {"Alkenes & Isomerism" if lang=="en" else "Les Alcènes"}</strong> (1. {"Double bond C=C" if lang=="en" else "Double liaison C=C"}, 2. {"(Z) and (E) stereoisomers" if lang=="en" else "Stéréoisomérie Z/E"}, 3. {"Bromine water test" if lang=="en" else "Test à l'eau de brome"})
                            </td>
                            <td>
                                <ul>
                                    <li>{"Molecular model sets (black carbon, white hydrogen)" if lang=="en" else "Modèles moléculaires boules et tiges"}</li>
                                    <li>{"Bromine water, cyclohexane, cyclohexene (alkene test)" if lang=="en" else "Eau de brome, cyclohexane, cyclohexène"}</li>
                                    <li>{"Test tubes, test tube rack, fume hood" if lang=="en" else "Tubes à essais, portoir, hotte aspirante"}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>{"Activities:" if lang=="en" else "Activités :"}</strong> {"Build models of butane and 2-methylpropane (structural isomers). Build (Z)-but-2-ene and (E)-but-2-ene. Test alkene unsaturation with bromine water." if lang=="en" else "Construction des isomères du butane et des isomères Z/E du but-2-ène. Test de décoloration de l'eau de brome."}<br>
                                <strong>{"Evaluation:" if lang=="en" else "Évaluation :"}</strong> {"IUPAC naming worksheets and Z/E configuration tests." if lang=="en" else "Exercices de nomenclature IUPAC et Devoir surveillé 5."}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        {render_official_footer(16, lang)}
    </div>
    """
    pages_html.append(p17)

    # ---------------- PAGE 18: ORGANIC CHEMISTRY UNITS 3 & 4 ----------------
    p18 = f"""
    <div class="page">
        <div>
            {render_official_header("1BAC Sciences", "Chemistry Component" if lang=="en" else "Composante Chimie", 17, lang)}
            
            <!-- UNIT 3 -->
            <div class="unit-block">
                <div class="unit-banner">
                    <span>{"Unit 3: Modifying the Carbon Skeleton" if lang=="en" else "Unité 3 : Modification du Squelette Carboné"}</span>
                    <span>3 {"Hours" if lang=="en" else "Heures"}</span>
                </div>
                <div class="unit-prereq-problem">
                    <div class="prereq-col">
                        <div class="block-title">{"Prerequisites:" if lang=="en" else "Prérequis :"}</div>
                        {"Alkanes, alkenes, cracking, refining." if lang=="en" else "Alcanes, alcènes, raffinage, liaisons C-C."}
                    </div>
                    <div class="problem-col">
                        <div class="block-title">{"Problem Situation:" if lang=="en" else "Situation-Problème :"}</div>
                        {"Petroleum fractions undergo chemical transformations to produce high-octane gasoline. How do cracking, reforming, and polymerization modify carbon chains?" if lang=="en" else "Les coupes pétrolières sont transformées pour produire des carburants nobles. Comment le craquage, le reformage et la polymérisation modifient-ils les chaînes ?"}
                    </div>
                </div>
                <table class="pedagogical-table">
                    <thead><tr><th style="width:25%;">{"Objectives" if lang=="en" else "Objectifs"}</th><th style="width:25%;">{"Contents" if lang=="en" else "Contenus"}</th><th style="width:25%;">{"Didactic Materials" if lang=="en" else "Matériel Didactique"}</th><th style="width:25%;">{"Activities & Evaluation" if lang=="en" else "Activités & Évaluation"}</th></tr></thead>
                    <tbody>
                        <tr>
                            <td>
                                <ul>
                                    <li>{"Shortening carbon chain: catalytic thermal cracking." if lang=="en" else "Raccourcissement de chaîne : craquage catalytique."}</li>
                                    <li>{"Isomerization, cyclization, and dehydrogenation (reforming)." if lang=="en" else "Isomérisation, cyclisation, déshydrogénation (reformage)."}</li>
                                    <li>{"Lengthening carbon chain: addition polymerization (n M → [M]_n)." if lang=="en" else "Allongement de chaîne : polymérisation d'addition."}</li>
                                    <li>{"Industrial applications: plastics, high-octane automotive fuels." if lang=="en" else "Applications : matières plastiques et carburants à haut indice d'octane."}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>I. {"Why Modify Carbon Chains?" if lang=="en" else "Pourquoi Modifier le Squelette ?"}</strong> (1. {"Producing high-grade fuels" if lang=="en" else "Carburants performants"}, 2. {"Chemical industry feedstocks" if lang=="en" else "Matières premières pour polymères"})<br>
                                <strong>II. {"Modification Reactions" if lang=="en" else "Réactions de Modification"}</strong> (1. {"Chain shortening: cracking" if lang=="en" else "Craquage catalytique"}, 2. {"Reforming: isomerization & cyclization" if lang=="en" else "Reformage catalytique"}, 3. {"Chain lengthening: polymerization" if lang=="en" else "Polymérisation"})
                            </td>
                            <td>
                                <ul>
                                    <li>{"Paraffin oil, ceramic catalyst fragments / brick piece" if lang=="en" else "Huile de paraffine, catalyseur céramique / morceau de brique"}</li>
                                    <li>{"Pyrex test tube, bent delivery tube, bromine water test" if lang=="en" else "Tube à essai en pyrex, tube coudé, eau de brome"}</li>
                                    <li>{"Styrene monomer, benzoyl peroxide catalyst" if lang=="en" else "Monocuivre de styrène, peroxyde de benzoyle"}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>{"Activities:" if lang=="en" else "Activités :"}</strong> {"Perform catalytic cracking of paraffin oil over hot ceramic; collect gas and decolorize bromine water (confirming alkene formation). Polymerize styrene." if lang=="en" else "Craquage catalytique de la paraffine et décoloration de l'eau de brome par les gaz formés. Synthèse du polystyrène."}<br>
                                <strong>{"Evaluation:" if lang=="en" else "Évaluation :"}</strong> {"Equations of cracking and addition polymer repeating unit identification." if lang=="en" else "Équations de craquage et motif de polymérisation."}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- UNIT 4 -->
            <div class="unit-block">
                <div class="unit-banner">
                    <span>{"Unit 4: Functional Groups - Reactivity of Alcohols" if lang=="en" else "Unité 4 : Groupes Caractéristiques - Réactivité des Alcools"}</span>
                    <span>5 {"Hours" if lang=="en" else "Heures"}</span>
                </div>
                <div class="unit-prereq-problem">
                    <div class="prereq-col">
                        <div class="block-title">{"Prerequisites:" if lang=="en" else "Prérequis :"}</div>
                        {"Alkanes, redox reactions, functional groups." if lang=="en" else "Alcanes, réactions redox, groupes caractéristiques."}
                    </div>
                    <div class="problem-col">
                        <div class="block-title">{"Problem Situation:" if lang=="en" else "Situation-Problème :"}</div>
                        {"Bees communicate with pheromones containing alcohols and aldehydes. How are the three classes of alcohols identified, and how does mild oxidation distinguish them?" if lang=="en" else "Les phéromones contiennent des alcools et aldéhydes. Comment distinguer les trois classes d'alcools et que donne leur oxydation ménagée ?"}
                    </div>
                </div>
                <table class="pedagogical-table">
                    <thead><tr><th style="width:25%;">{"Objectives" if lang=="en" else "Objectifs"}</th><th style="width:25%;">{"Contents" if lang=="en" else "Contenus"}</th><th style="width:25%;">{"Didactic Materials" if lang=="en" else "Matériel Didactique"}</th><th style="width:25%;">{"Activities & Evaluation" if lang=="en" else "Activités & Évaluation"}</th></tr></thead>
                    <tbody>
                        <tr>
                            <td>
                                <ul>
                                    <li>{"Identify hydroxyl group -OH and alcohol classes (1°, 2°, 3°)." if lang=="en" else "Groupe hydroxyle -OH et classes d'alcools (1°, 2°, 3°)."}</li>
                                    <li>{"Mild oxidation of primary alcohol → aldehyde → carboxylic acid." if lang=="en" else "Oxydation ménagée d'alcool 1° → aldéhyde → acide."}</li>
                                    <li>{"Mild oxidation of secondary alcohol → ketone." if lang=="en" else "Oxydation ménagée d'alcool 2° → cétone."}</li>
                                    <li>{"Tertiary alcohols do not undergo mild oxidation." if lang=="en" else "Les alcools tertiaires ne s'oxydent pas."}</li>
                                    <li>{"Characterization tests: 2,4-DNPH (yellow/orange ppt), Fehling (red ppt), Tollens (silver mirror)." if lang=="en" else "Tests : 2,4-DNPH, liqueur de Fehling, réactif de Tollens."}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>I. {"Alcohols & Classes" if lang=="en" else "Les Alcools"}</strong> (1. {"General formula R-OH" if lang=="en" else "Formule générale R-OH"}, 2. {"Primary, secondary, tertiary classes" if lang=="en" else "Alcools primaire, secondaire, tertiaire"}, 3. {"Nomenclature" if lang=="en" else "Nomenclature"})<br>
                                <strong>II. {"Mild Oxidation" if lang=="en" else "Oxydation Ménagée"}</strong> (1. {"Primary alcohol oxidation" if lang=="en" else "Oxydation de l'alcool primaire"}, 2. {"Secondary alcohol oxidation" if lang=="en" else "Oxydation de l'alcool secondaire"}, 3. {"Tertiary alcohol resistance" if lang=="en" else "Inertie de l'alcool tertiaire"})<br>
                                <strong>III. {"Identification Tests" if lang=="en" else "Tests d'Identification"}</strong> (1. {"2,4-DNPH for carbonyls" if lang=="en" else "Test à la 2,4-DNPH"}, 2. {"Fehling test for aldehydes" if lang=="en" else "Test de Fehling"}, 3. {"Redox equations with MnO₄⁻" if lang=="en" else "Équations d'oxydoréduction"})
                            </td>
                            <td>
                                <ul>
                                    <li>{"Butan-1-ol (1°), butan-2-ol (2°), 2-methylpropan-2-ol (3°)" if lang=="en" else "Butan-1-ol (1°), butan-2-ol (2°), 2-méthylpropan-2-ol (3°)"}</li>
                                    <li>{"Acidified potassium permanganate solution KMnO₄, sulfuric acid" if lang=="en" else "Permanganate acidifié, acide sulfurique"}</li>
                                    <li>{"2,4-DNPH reagent, Fehling solution A & B, hot water bath" if lang=="en" else "2,4-DNPH, liqueur de Fehling, bain-marie"}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>{"Activities:" if lang=="en" else "Activités :"}</strong> {"Oxidize the 3 alcohols with acidified KMnO₄. Test products with 2,4-DNPH and Fehling; verify 1° forms aldehyde then acid, 2° forms ketone, 3° does not react." if lang=="en" else "Oxydation des 3 alcools par KMnO₄ ; tests à la 2,4-DNPH et liqueur de Fehling pour identifier aldéhyde, cétone et absence de réaction."}<br>
                                <strong>{"Evaluation:" if lang=="en" else "Évaluation :"}</strong> {"Balancing alcohol oxidation redox equations and end-of-year Supervised Exam 6." if lang=="en" else "Équations d'oxydation ménagée et Devoir surveillé 6."}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        {render_official_footer(17, lang)}
    </div>
    """
    pages_html.append(p18)

    return f"""<!DOCTYPE html>
<html lang="{lang}">
<head>
<meta charset="UTF-8">
<title>Moroccan 1st Year Baccalaureate Science Curriculum Lesson Plans - Professor AYOUB KHAMMOUR</title>
<style>{CSS_PAGE_STYLE}</style>
</head>
<body>
{"".join(pages_html)}
</body>
</html>"""

def main():
    out_dir = "/home/ubuntu/projects/codshop/pdf_translations"
    os.makedirs(out_dir, exist_ok=True)

    en_html = os.path.join(out_dir, "1BAC_Physics_Chemistry_Lesson_Plans_English.html")
    en_pdf = os.path.join(out_dir, "1BAC_Physics_Chemistry_Lesson_Plans_English.pdf")
    fr_html = os.path.join(out_dir, "1BAC_Physique_Chimie_Fiches_Pedagogiques_Francais.html")
    fr_pdf = os.path.join(out_dir, "1BAC_Physique_Chimie_Fiches_Pedagogiques_Francais.pdf")

    print("Writing 1BAC English HTML (18 pages)...")
    with open(en_html, "w", encoding="utf-8") as f:
        f.write(build_1bac_html("en"))

    print("Writing 1BAC French HTML (18 pages)...")
    with open(fr_html, "w", encoding="utf-8") as f:
        f.write(build_1bac_html("fr"))

    print("Compiling 1BAC English PDF with Chromium...")
    subprocess.run(["/snap/bin/chromium", "--headless=new", "--disable-gpu", "--no-sandbox", f"--print-to-pdf={en_pdf}", f"file://{en_html}"], check=True)

    print("Compiling 1BAC French PDF with Chromium...")
    subprocess.run(["/snap/bin/chromium", "--headless=new", "--disable-gpu", "--no-sandbox", f"--print-to-pdf={fr_pdf}", f"file://{fr_html}"], check=True)

    print(f"1BAC English PDF: {os.path.getsize(en_pdf)} bytes")
    print(f"1BAC French PDF: {os.path.getsize(fr_pdf)} bytes")

if __name__ == "__main__":
    main()
