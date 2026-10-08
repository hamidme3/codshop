# -*- coding: utf-8 -*-
"""
Full 1-to-1 Page-by-Page Generator for Second Year Baccalaureate Sciences (2BAC - 17 Pages)
Author: Professor AYOUB KHAMMOUR (SOM: 1503811)
"""

import os
import subprocess
from exhaustive_curriculum_builder import CSS_PAGE_STYLE, render_official_header, render_official_footer

def build_2bac_html(lang="en"):
    pages_html = []

    # ---------------- PAGE 1: COVER ----------------
    level_title = "2nd Year Baccalaureate - Sciences" if lang == "en" else "Deuxième Année du Baccalauréat - Sciences"
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
            {"Experimental Sciences (Physics-Chemistry, SVT, Agronomy) & Mathematical Sciences (A & B)" if lang=="en" else "Filières des Sciences Expérimentales (PC, SVT, Agronomie) & Sciences Mathématiques (A et B)"}
        </div>
        <div class="cover-author">
            <strong>{author_role}</strong><br>
            <span style="font-size: 10pt; color: #64748b;">Registration No / N° SOM : 1503811</span>
        </div>
        <div class="cover-meta">{meta_ref}</div>
    </div>
    """
    pages_html.append(p1)

    # ---------------- PAGE 2: WAVES OVERVIEW & UNIT 1 ----------------
    p2 = f"""
    <div class="page">
        <div>
            {render_official_header("2BAC Sciences", "Physics Component" if lang=="en" else "Composante Physique", 1, lang)}
            <div class="overview-box">
                <div class="overview-title">{"Introduction & Part 1: Waves (Total: 15 - 16 Hours)" if lang=="en" else "Introduction & Partie 1 : Les Ondes (15 - 16 Heures)"}</div>
                <div class="overview-grid">
                    <div>
                        <strong>{"Questions Posed to the Physicist (1h):" if lang=="en" else "Questions posées au physicien (1h) :"}</strong>
                        {"Identify role of physics in society, scientific questions, measurement uncertainties, and scientific models." if lang=="en" else "Identifier les rôles de la physique dans la société, questions ouvertes, incertitudes de mesure et modèles."}
                    </div>
                    <div>
                        <strong>{"Part 1 Competencies & Units:" if lang=="en" else "Compétences Visées & Unités :"}</strong>
                        {"Wave models for mechanical and light waves. Ultrasonic waves applications. Simulation tools. 1. Progressive Mechanical Waves (5h) • 2. Periodic Mechanical Waves (5h) • 3. Propagation of a Light Wave (5-6h)" if lang=="en" else "Adopter le modèle ondulatoire. Applications des ultrasons. Logiciels de simulation. 1. Ondes mécaniques progressives (5h) • 2. Ondes périodiques (5h) • 3. Propagation d'une onde lumineuse (5-6h)"}
                    </div>
                </div>
            </div>

            <!-- UNIT 1 -->
            <div class="unit-block">
                <div class="unit-banner">
                    <span>{"Unit 1: Progressive Mechanical Waves" if lang=="en" else "Unité 1 : Les Ondes Mécaniques Progressives"}</span>
                    <span>5 {"Hours" if lang=="en" else "Heures"}</span>
                </div>
                <div class="unit-prereq-problem">
                    <div class="prereq-col">
                        <div class="block-title">{"Prerequisites:" if lang=="en" else "Prérequis :"}</div>
                        {"Relation v = d / t, oscilloscope time base, mechanical energy." if lang=="en" else "Relation v = d/t, oscilloscope et base de temps, énergie mécanique."}
                    </div>
                    <div class="problem-col">
                        <div class="block-title">{"Problem Situation:" if lang=="en" else "Situation-Problème :"}</div>
                        {"A disturbance propagates through an elastic medium causing temporary local alterations. What defines mechanical waves and their time delay?" if lang=="en" else "Une perturbation se propage dans un milieu élastique sans transport de matière. Que traduit ce phénomène et comment définir le retard temporel ?"}
                    </div>
                </div>
                <table class="pedagogical-table">
                    <thead><tr><th style="width:25%;">{"Objectives" if lang=="en" else "Objectifs"}</th><th style="width:25%;">{"Contents" if lang=="en" else "Contenus"}</th><th style="width:25%;">{"Didactic Materials" if lang=="en" else "Matériel Didactique"}</th><th style="width:25%;">{"Activities & Evaluation" if lang=="en" else "Activités & Évaluation"}</th></tr></thead>
                    <tbody>
                        <tr>
                            <td>
                                <ul>
                                    <li>{"Qualitative evidence of 1D, 2D, and 3D waves." if lang=="en" else "Mise en évidence des ondes à 1D, 2D et 3D."}</li>
                                    <li>{"Transverse waves (rope, water) vs longitudinal waves (sound, spring)." if lang=="en" else "Ondes transversales et longitudinales."}</li>
                                    <li>{"General wave properties (propagation, superposition, non-transport of matter)." if lang=="en" else "Propriétés générales (propagation, superposition)."}</li>
                                    <li>{"Propagation velocity v = d / Δt and affecting factors (tension, density)." if lang=="en" else "Vitesse de propagation v = d / Δt et facteurs d'influence."}</li>
                                    <li>{"Time delay τ = d / v and motion relation y_M(t) = y_S(t - τ)." if lang=="en" else "Retard temporel τ = d / v et élongation y_M(t) = y_S(t - τ)."}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>I. {"Wave Examples" if lang=="en" else "Exemples d'Ondes"}</strong> (1. {"Transverse wave" if lang=="en" else "Onde transversale"}, 2. {"Longitudinal wave" if lang=="en" else "Onde longitudinale"})<br>
                                <strong>II. {"Properties of Progressive Waves" if lang=="en" else "Propriétés des Ondes"}</strong> (1. {"Definition" if lang=="en" else "Définition"}, 2. {"Propagation direction" if lang=="en" else "Sens de propagation"}, 3. {"Velocity expression" if lang=="en" else "Vitesse de propagation"})<br>
                                <strong>III. {"1D Progressive Wave & Time Delay" if lang=="en" else "Onde à 1D et Retard Temporel"}</strong> (1. {"Time delay τ" if lang=="en" else "Retard temporel τ"}, 2. {"Elongation relationship" if lang=="en" else "Relation d'élongation"})
                            </td>
                            <td>
                                <ul>
                                    <li>{"Textbook, board, computer animations" if lang=="en" else "Manuel, tableau, simulations TICE"}</li>
                                    <li>{"Rope, spring, ripple tank, tuning fork" if lang=="en" else "Corde, ressort, cuve à ondes, diapason"}</li>
                                    <li>{"Bell jar with vacuum pump, 2 microphones, oscilloscope" if lang=="en" else "Cloche à vide, 2 microphones, oscilloscope"}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>{"Activities:" if lang=="en" else "Activités :"}</strong> {"Demonstrate sound non-propagation in vacuum. Record signals from 2 microphones to compute sound velocity in air (v ≈ 340 m/s)." if lang=="en" else "Démonstration du son dans le vide. Mesure de la vitesse du son par 2 microphones sur oscilloscope."}<br>
                                <strong>{"Evaluation:" if lang=="en" else "Évaluation :"}</strong> {"Diagnostic tests, time delay calculations, Exam 1." if lang=="en" else "Questions orales, calculs de retard et Devoir surveillé 1."}
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

    # ---------------- PAGE 3: WAVES UNITS 2 & 3 ----------------
    p3 = f"""
    <div class="page">
        <div>
            {render_official_header("2BAC Sciences", "Physics Component" if lang=="en" else "Composante Physique", 2, lang)}
            
            <!-- UNIT 2 -->
            <div class="unit-block">
                <div class="unit-banner">
                    <span>{"Unit 2: Periodic Mechanical Waves" if lang=="en" else "Unité 2 : Les Ondes Mécaniques Progressives Périodiques"}</span>
                    <span>5 {"Hours" if lang=="en" else "Heures"}</span>
                </div>
                <div class="unit-prereq-problem">
                    <div class="prereq-col">
                        <div class="block-title">{"Prerequisites:" if lang=="en" else "Prérequis :"}</div>
                        {"Progressive mechanical wave, velocity, time delay, oscilloscope." if lang=="en" else "Onde progressive, vitesse, retard temporel, oscilloscope."}
                    </div>
                    <div class="problem-col">
                        <div class="block-title">{"Problem Situation:" if lang=="en" else "Situation-Problème :"}</div>
                        {"Ocean swells act as sinusoidal waves. What characterizes double periodicity, and what happens when waves encounter a slit comparable to wavelength?" if lang=="en" else "La houle se propage sous forme sinusoïdale. Que caractérise la double périodicité et que se passe-t-il devant une fente étroite ?"}
                    </div>
                </div>
                <table class="pedagogical-table">
                    <thead><tr><th style="width:25%;">{"Objectives" if lang=="en" else "Objectifs"}</th><th style="width:25%;">{"Contents" if lang=="en" else "Contenus"}</th><th style="width:25%;">{"Didactic Materials" if lang=="en" else "Matériel Didactique"}</th><th style="width:25%;">{"Activities & Evaluation" if lang=="en" else "Activités & Évaluation"}</th></tr></thead>
                    <tbody>
                        <tr>
                            <td>
                                <ul>
                                    <li>{"Sinusoidal wave: double periodicity T (temporal) and λ (spatial)." if lang=="en" else "Double périodicité temporelle T et spatiale λ."}</li>
                                    <li>{"Fundamental wave equation: λ = v · T = v / N." if lang=="en" else "Relation fondamentale : λ = v · T = v / N."}</li>
                                    <li>{"Points oscillating in phase (d = k·λ) and in phase opposition." if lang=="en" else "Points en phase (d = k·λ) et en opposition de phase."}</li>
                                    <li>{"Mechanical diffraction condition: slit aperture a ≤ λ." if lang=="en" else "Diffraction des ondes mécaniques (a ≤ λ)."}</li>
                                    <li>{"Dispersive medium: velocity depends on frequency N." if lang=="en" else "Milieu dispersif : la vitesse dépend de la fréquence."}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>I. {"Periodic Wave" if lang=="en" else "Onde Périodique"}</strong> (1. {"Definition" if lang=="en" else "Définition"}, 2. {"Velocity" if lang=="en" else "Vitesse"}, 3. {"Stroboscopic observation" if lang=="en" else "Stroboscope"})<br>
                                <strong>II. {"Sinusoidal Wave" if lang=="en" else "Onde Sinusoïdale"}</strong> (1. {"Wave along string" if lang=="en" else "Onde sur corde"}, 2. {"Water ripples (circular & plane)" if lang=="en" else "Surface de l'eau"}, 3. {"Sound waves" if lang=="en" else "Ondes sonores"})<br>
                                <strong>III. {"Diffraction Phenomenon" if lang=="en" else "Phénomène de Diffraction"}</strong> (1. {"Condition a ≤ λ" if lang=="en" else "Condition a ≤ λ"}, 2. {"Properties of diffracted wave" if lang=="en" else "Caractéristiques de l'onde diffractée"})<br>
                                <strong>IV. {"Dispersive Media" if lang=="en" else "Milieu Dispersif"}</strong>
                            </td>
                            <td>
                                <ul>
                                    <li>{"Ripple tank with mechanical vibrator, stroboscope" if lang=="en" else "Cuve à ondes avec vibreur, stroboscope"}</li>
                                    <li>{"Adjustable barrier slit diaphragms" if lang=="en" else "Diaphragmes à fente réglable"}</li>
                                    <li>{"GBF generator, loudspeaker, 2 microphones, oscilloscope" if lang=="en" else "Générateur GBF, haut-parleur, 2 micros, oscilloscope"}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>{"Activities:" if lang=="en" else "Activités :"}</strong> {"Freeze water ripples with stroboscope to measure λ. Demonstrate diffraction through slit. Vary frequency to prove water is dispersive." if lang=="en" else "Immobilité apparente au stroboscope pour mesurer λ. Observation de la diffraction et dispersion sur cuve à ondes."}<br>
                                <strong>{"Evaluation:" if lang=="en" else "Évaluation :"}</strong> {"Phase matching exercises on oscilloscope and Exam 1." if lang=="en" else "Exercices de déphasage et Devoir surveillé 1."}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- UNIT 3 -->
            <div class="unit-block">
                <div class="unit-banner">
                    <span>{"Unit 3: Propagation of a Light Wave" if lang=="en" else "Unité 3 : Propagation d'une Onde Lumineuse"}</span>
                    <span>6 {"Hours" if lang=="en" else "Heures"}</span>
                </div>
                <div class="unit-prereq-problem">
                    <div class="prereq-col">
                        <div class="block-title">{"Prerequisites:" if lang=="en" else "Prérequis :"}</div>
                        {"Mechanical wave diffraction, refractive index, Snell-Descartes laws." if lang=="en" else "Diffraction mécanique, indice de réfraction, lois de Descartes."}
                    </div>
                    <div class="problem-col">
                        <div class="block-title">{"Problem Situation:" if lang=="en" else "Situation-Problème :"}</div>
                        {"Laser beams measure microscopic dimensions of hair or wire fibers with micron precision. How does diffraction establish the wave nature of light?" if lang=="en" else "Le laser permet de mesurer des diamètres de cheveux par diffraction. Comment prouver la nature ondulatoire de la lumière ?"}
                    </div>
                </div>
                <table class="pedagogical-table">
                    <thead><tr><th style="width:25%;">{"Objectives" if lang=="en" else "Objectifs"}</th><th style="width:25%;">{"Contents" if lang=="en" else "Contenus"}</th><th style="width:25%;">{"Didactic Materials" if lang=="en" else "Matériel Didactique"}</th><th style="width:25%;">{"Activities & Evaluation" if lang=="en" else "Activités & Évaluation"}</th></tr></thead>
                    <tbody>
                        <tr>
                            <td>
                                <ul>
                                    <li>{"Wave model of light proven by diffraction." if lang=="en" else "Nature ondulatoire de la lumière prouvée par diffraction."}</li>
                                    <li>{"Diffraction angular half-width: θ = λ / a." if lang=="en" else "Écart angulaire de diffraction : θ = λ / a."}</li>
                                    <li>{"Relation with central fringe width: L = 2 · λ · D / a." if lang=="en" else "Largeur de tache centrale : L = 2·λ·D / a."}</li>
                                    <li>{"Monochromatic vs polychromatic light; white light spectrum." if lang=="en" else "Lumière monochromatique et polychromatique."}</li>
                                    <li>{"Frequency ν is invariant across media; speed v = c / n." if lang=="en" else "Invariance de la fréquence ν selon le milieu ; v = c / n."}</li>
                                    <li>{"Dispersion by prism and Snell-Descartes refraction." if lang=="en" else "Dispersion par le prisme et lois de Descartes."}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>I. {"Diffraction of Light" if lang=="en" else "Diffraction de la Lumière"}</strong> (1. {"Wave model" if lang=="en" else "Modèle ondulatoire"}, 2. {"Slit diffraction" if lang=="en" else "Diffraction par une fente"}, 3. {"Formula θ = λ/a = L/(2D)" if lang=="en" else "Formule θ = λ/a = L/(2D)"})<br>
                                <strong>II. {"Dispersion of Light" if lang=="en" else "Dispersion de la Lumière"}</strong> (1. {"Refractive index n(ν)" if lang=="en" else "Indice n(ν)"}, 2. {"Prism dispersion" if lang=="en" else "Dispersion par le prisme"}, 3. {"Prism formulas" if lang=="en" else "Formules du prisme"})
                            </td>
                            <td>
                                <ul>
                                    <li>{"Red He-Ne or diode laser (650 nm), green laser" if lang=="en" else "Laser rouge (650 nm) et vert"}</li>
                                    <li>{"Calibrated slits (a = 0.04 to 0.2 mm), thin wires, screen" if lang=="en" else "Fentes étalonnées, fils calibrés, écran"}</li>
                                    <li>{"Glass prism, goniometer, white light source" if lang=="en" else "Prisme en verre, goniomètre, lanterne"}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>{"Activities:" if lang=="en" else "Activités :"}</strong> {"Project laser diffraction pattern; measure central fringe width L vs distance D and slit width a; deduce laser wavelength λ." if lang=="en" else "Mesure de la tache centrale L en fonction de a et D ; déduction de la longueur d'onde du laser."}<br>
                                <strong>{"Evaluation:" if lang=="en" else "Évaluation :"}</strong> {"Linear regression θ = f(1/a) problems and Exam 1." if lang=="en" else "Exploitation de droites d'étalonnage et Devoir 1."}
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

    # ---------------- PAGE 4: NUCLEAR UNITS 1 & 2 ----------------
    p4 = f"""
    <div class="page">
        <div>
            {render_official_header("2BAC Sciences", "Physics Component" if lang=="en" else "Composante Physique", 3, lang)}
            <div class="overview-box">
                <div class="overview-title">{"Part 2: Nuclear Transformations (Total: 10 - 14 Hours)" if lang=="en" else "Partie 2 : Les Transformations Nucléaires (10 - 14 Heures)"}</div>
            </div>

            <!-- UNIT 1 -->
            <div class="unit-block">
                <div class="unit-banner">
                    <span>{"Unit 1: Radioactive Decay" if lang=="en" else "Unité 1 : La Décroissance Radioactive"}</span>
                    <span>5 {"Hours" if lang=="en" else "Heures"}</span>
                </div>
                <div class="unit-prereq-problem">
                    <div class="prereq-col">
                        <div class="block-title">{"Prerequisites:" if lang=="en" else "Prérequis :"}</div>
                        {"Atom structure, isotopes, atomic number Z, neutral atom." if lang=="en" else "Structure de l'atome, isotopes, numéro Z, neutralité."}
                    </div>
                    <div class="problem-col">
                        <div class="block-title">{"Problem Situation:" if lang=="en" else "Situation-Problème :"}</div>
                        {"Carbon-14 dating determines the age of ancient fossils and archeological relics. What causes radioactive decay and what laws govern it?" if lang=="en" else "La datation au Carbone 14 permet de dater des fossiles. Qu'est-ce que la décroissance radioactive et quelle loi mathématique la régit ?"}
                    </div>
                </div>
                <table class="pedagogical-table">
                    <thead><tr><th style="width:25%;">{"Objectives" if lang=="en" else "Objectifs"}</th><th style="width:25%;">{"Contents" if lang=="en" else "Contenus"}</th><th style="width:25%;">{"Didactic Materials" if lang=="en" else "Matériel Didactique"}</th><th style="width:25%;">{"Activities & Evaluation" if lang=="en" else "Activités & Évaluation"}</th></tr></thead>
                    <tbody>
                        <tr>
                            <td>
                                <ul>
                                    <li>{"Nuclide notation ^A_Z X and Segrè chart (N vs Z stability valley)." if lang=="en" else "Symbole ^A_Z X et diagramme de Segrè."}</li>
                                    <li>{"Soddy's conservation laws for nucleon number A and charge Z." if lang=="en" else "Lois de conservation de Soddy (A et Z)."}</li>
                                    <li>{"Types of spontaneous decay: α, β⁻, β⁺, and γ de-excitation." if lang=="en" else "Radioactivités α, β⁻, β⁺ et émission γ."}</li>
                                    <li>{"Radioactive decay law: N(t) = N₀ · e^(-λt)." if lang=="en" else "Loi de décroissance : N(t) = N₀ · e^(-λt)."}</li>
                                    <li>{"Half-life: t_(1/2) = ln(2) / λ = τ · ln(2) and activity A(t) = λ·N(t) (Bq)." if lang=="en" else "Demi-vie t_(1/2) = ln(2)/λ et activité A(t) en Bq."}</li>
                                    <li>{"Carbon-14 archaeological dating calculations." if lang=="en" else "Principe de datation au Carbone 14."}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>I. {"Nuclear Stability" if lang=="en" else "Stabilité Nucléaire"}</strong> (1. {"Nuclide symbol" if lang=="en" else "Symbole du nucléide"}, 2. {"Isotopes" if lang=="en" else "Isotopes"}, 3. {"Segrè diagram" if lang=="en" else "Diagramme de Segrè"})<br>
                                <strong>II. {"Radioactivity Types" if lang=="en" else "Radioactivité"}</strong> (1. {"Soddy's laws" if lang=="en" else "Lois de Soddy"}, 2. {"α, β⁻, β⁺ decays" if lang=="en" else "Désintégrations α, β⁻, β⁺"}, 3. {"γ radiation" if lang=="en" else "Rayonnement γ"})<br>
                                <strong>III. {"Decay Law" if lang=="en" else "Loi de Décroissance"}</strong> (1. {"N(t) = N₀ e^(-λt)" if lang=="en" else "N(t) = N₀ e^(-λt)"}, 2. {"Half-life t_(1/2)" if lang=="en" else "Demi-vie t_(1/2)"}, 3. {"Activity A(t)" if lang=="en" else "Activité A(t)"})<br>
                                <strong>IV. {"Dating" if lang=="en" else "Datation"}</strong> (1. {"Carbon-14" if lang=="en" else "Carbone 14"}, 2. {"Geological dating" if lang=="en" else "Datation géologique"})
                            </td>
                            <td>
                                <ul>
                                    <li>{"Geiger counter and background radiation sensor" if lang=="en" else "Compteur Geiger et mesure du bruit de fond"}</li>
                                    <li>{"Segrè chart poster / computer chart" if lang=="en" else "Diagramme de Segrè mural et logiciel"}</li>
                                    <li>{"Dice model simulation program for decay law" if lang=="en" else "Simulation numérique du lancer de dés"}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>{"Activities:" if lang=="en" else "Activités :"}</strong> {"Simulate radioactive decay with dice rolling; plot N(t) curve; deduce half-life. Balance decay reactions using Soddy's laws." if lang=="en" else "Simulation par le jeu des dés ; tracé de N(t) ; calcul de t_(1/2) et équilibrage par les lois de Soddy."}<br>
                                <strong>{"Evaluation:" if lang=="en" else "Évaluation :"}</strong> {"Decay equations and dating calculation exercises." if lang=="en" else "Exercices de datation et Devoir surveillé 2."}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- UNIT 2 -->
            <div class="unit-block">
                <div class="unit-banner">
                    <span>{"Unit 2: Nuclei, Mass and Energy" if lang=="en" else "Unité 2 : Noyaux, Masse et Énergie"}</span>
                    <span>5 - 9 {"Hours" if lang=="en" else "Heures"}</span>
                </div>
                <div class="unit-prereq-problem">
                    <div class="prereq-col">
                        <div class="block-title">{"Prerequisites:" if lang=="en" else "Prérequis :"}</div>
                        {"Radioactivity, conservation laws, energy units." if lang=="en" else "Radioactivité, lois de conservation, unités d'énergie."}
                    </div>
                    <div class="problem-col">
                        <div class="block-title">{"Problem Situation:" if lang=="en" else "Situation-Problème :"}</div>
                        {"Nuclear reactors release immense energy from Uranium-235 fission, while stars fuse hydrogen. What is binding energy and the Aston curve?" if lang=="en" else "Les réacteurs libèrent une énergie colossale par fission de l'Uranium 235. D'où provient cette énergie et qu'est-ce que la courbe d'Aston ?"}
                    </div>
                </div>
                <table class="pedagogical-table">
                    <thead><tr><th style="width:25%;">{"Objectives" if lang=="en" else "Objectifs"}</th><th style="width:25%;">{"Contents" if lang=="en" else "Contenus"}</th><th style="width:25%;">{"Didactic Materials" if lang=="en" else "Matériel Didactique"}</th><th style="width:25%;">{"Activities & Evaluation" if lang=="en" else "Activités & Évaluation"}</th></tr></thead>
                    <tbody>
                        <tr>
                            <td>
                                <ul>
                                    <li>{"Mass-energy equivalence: E = m · c²." if lang=="en" else "Équivalence masse-énergie d'Einstein : E = m · c²."}</li>
                                    <li>{"Mass defect: Δm = [Z·m_p + (A-Z)·m_n] - m_noyau > 0." if lang=="en" else "Défaut de masse : Δm = [Z·m_p + (A-Z)·m_n] - m_noyau."}</li>
                                    <li>{"Nuclear binding energy: E_l = Δm · c² (MeV) & E_l / A." if lang=="en" else "Énergie de liaison : E_l = Δm · c² et E_l / A."}</li>
                                    <li>{"Aston curve analysis (-E_l/A vs A); nuclear fission and fusion." if lang=="en" else "Courbe d'Aston ; fission et fusion nucléaires."}</li>
                                    <li>{"Energy balance of nuclear reaction: ΔE = [Σm_prod - Σm_reac]·c²." if lang=="en" else "Bilan énergétique : ΔE = [Σm_prod - Σm_reac]·c²."}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>I. {"Mass-Energy Equivalence" if lang=="en" else "Équivalence Masse-Énergie"}</strong> (1. {"Mass defect Δm" if lang=="en" else "Défaut de masse"}, 2. {"Binding energy E_l" if lang=="en" else "Énergie de liaison"}, 3. {"Binding energy per nucleon" if lang=="en" else "Énergie par nucléon"}, 4. {"Aston curve" if lang=="en" else "Courbe d'Aston"})<br>
                                <strong>II. {"Energy Balance of Nuclear Reactions" if lang=="en" else "Bilan Énergétique"}</strong> (1. {"General reaction" if lang=="en" else "Cas général"}, 2. {"Spontaneous decay" if lang=="en" else "Désintégration"}, 3. {"Fission and fusion" if lang=="en" else "Fission et fusion"})<br>
                                <strong>III. {"Nuclear Energy Hazards & Uses" if lang=="en" else "Applications & Risques"}</strong>
                            </td>
                            <td>
                                <ul>
                                    <li>{"Official Aston curve chart, mass tables in u and MeV/c²" if lang=="en" else "Courbe d'Aston officielle, tables de masses atomiques"}</li>
                                    <li>{"Video documentary on nuclear power plants & tokamak fusion" if lang=="en" else "Documentaires vidéo sur les réacteurs et ITER"}</li>
                                    <li>{"Scientific calculators for mass defect computation" if lang=="en" else "Calculatrices scientifiques pour calculs de Δm"}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>{"Activities:" if lang=="en" else "Activités :"}</strong> {"Compute binding energy of Helium-4 and Iron-56. Calculate released energy E_lib = |ΔE| for U-235 fission and D-T fusion." if lang=="en" else "Calcul de l'énergie de liaison de l'hélium et du fer 56. Bilan d'énergie libérée lors de la fission et fusion."}<br>
                                <strong>{"Evaluation:" if lang=="en" else "Évaluation :"}</strong> {"Nuclear reaction energy balance problems and Supervised Exam 2." if lang=="en" else "Exercices de bilans nucléaires et Devoir surveillé 2."}
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

    # ---------------- PAGE 5: ELECTRICITY UNIT 1 (RC) ----------------
    p5 = f"""
    <div class="page">
        <div>
            {render_official_header("2BAC Sciences", "Physics Component" if lang=="en" else "Composante Physique", 4, lang)}
            <div class="overview-box">
                <div class="overview-title">{"Part 3: Electricity (Total: 22 - 38 Hours) • Unit 1: The RC Dipole" if lang=="en" else "Partie 3 : Électricité (22 - 38 Heures) • Unité 1 : Le Dipôle RC"}</div>
                <div class="overview-grid">
                    <div>
                        <strong>{"Competencies:" if lang=="en" else "Compétences Visées :"}</strong>
                        {"Understand transient electrical regimes, differential equations, energy storage in capacitors and inductors, and electrical resonance." if lang=="en" else "Maîtriser les régimes transitoires, équations différentielles, stockage d'énergie dans les dipôles et résonance."}
                    </div>
                    <div>
                        <strong>{"Part Units:" if lang=="en" else "Unités de la Partie :"}</strong>
                        1. {"RC Dipole (6-7h)" if lang=="en" else "Dipôle RC (6-7h)"} • 
                        2. {"RL Dipole (6-7h)" if lang=="en" else "Dipôle RL (6-7h)"} • 
                        3. {"Free RLC Oscillations (8h)" if lang=="en" else "Oscillations libres RLC (8h)"} • 
                        4. {"Forced Oscillations (8h - SM)" if lang=="en" else "Oscillations forcées (8h - SM)"} • 
                        5. {"EM Waves & Communication (10h - SM)" if lang=="en" else "Modulation & communication (10h - SM)"}
                    </div>
                </div>
            </div>

            <!-- UNIT 1 -->
            <div class="unit-block">
                <div class="unit-banner">
                    <span>{"Unit 1: The RC Dipole" if lang=="en" else "Unité 1 : Le Dipôle RC"}</span>
                    <span>7 {"Hours" if lang=="en" else "Heures"}</span>
                </div>
                <div class="unit-prereq-problem">
                    <div class="prereq-col">
                        <div class="block-title">{"Prerequisites:" if lang=="en" else "Prérequis :"}</div>
                        {"Ohm's law, node/mesh laws, ammeters, voltmeters, oscilloscope." if lang=="en" else "Loi d'Ohm, lois des mailles/nœuds, multimètres, oscilloscope."}
                    </div>
                    <div class="problem-col">
                        <div class="block-title">{"Problem Situation:" if lang=="en" else "Situation-Problème :"}</div>
                        {"Camera flash units discharge a capacitor through a xenon flash lamp. What is a capacitor, how does it charge, and what is its time constant?" if lang=="en" else "Le flash d'un appareil photo résulte de la décharge d'un condensateur. Qu'est-ce qu'un condensateur et que vaut sa constante de temps ?"}
                    </div>
                </div>
                <table class="pedagogical-table">
                    <thead><tr><th style="width:25%;">{"Objectives" if lang=="en" else "Objectifs"}</th><th style="width:25%;">{"Contents" if lang=="en" else "Contenus"}</th><th style="width:25%;">{"Didactic Materials" if lang=="en" else "Matériel Didactique"}</th><th style="width:25%;">{"Activities & Evaluation" if lang=="en" else "Activités & Évaluation"}</th></tr></thead>
                    <tbody>
                        <tr>
                            <td>
                                <ul>
                                    <li>{"Capacitor definition, symbol, and charge q = C · u_C (Farads F)." if lang=="en" else "Condensateur, capacité C et relation q = C · u_C (Farads)."}</li>
                                    <li>{"Current-charge relation: i(t) = dq/dt = C · du_C/dt." if lang=="en" else "Courant : i(t) = dq/dt = C · du_C/dt."}</li>
                                    <li>{"Equivalent capacitance: parallel C_eq = Σ C_i; series 1/C_eq = Σ 1/C_i." if lang=="en" else "Capacité équivalente en parallèle et en série."}</li>
                                    <li>{"Establish and solve RC differential equation: u_C + RC·(du_C/dt) = E." if lang=="en" else "Équation différentielle de charge : u_C + RC·(du_C/dt) = E."}</li>
                                    <li>{"Time constant τ = R · C (seconds); graphical determination (tangent, 63%)." if lang=="en" else "Constante de temps τ = R·C ; détermination graphique (63%)."}</li>
                                    <li>{"Electrostatic energy stored: E_e = 0.5 · C · u_C² (Joules)." if lang=="en" else "Énergie emmagasinée : E_e = 0,5 · C · u_C² (Joules)."}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>I. {"The Capacitor" if lang=="en" else "Le Condensateur"}</strong> (1. {"Description" if lang=="en" else "Description"}, 2. {"Charge relation q = C·u_C" if lang=="en" else "Charge q = C·u_C"}, 3. {"Association in series & parallel" if lang=="en" else "Association série et parallèle"})<br>
                                <strong>II. {"RC Response to Voltage Step" if lang=="en" else "Réponse à un Échelon de Tension"}</strong> (1. {"Charging differential equation" if lang=="en" else "Charge : équation différentielle"}, 2. {"Analytical solution u_C(t) = E(1 - e^(-t/τ))" if lang=="en" else "Solution analytique"}, 3. {"Discharge differential equation" if lang=="en" else "Décharge du condensateur"}, 4. {"Time constant τ = RC" if lang=="en" else "Constante de temps τ"})<br>
                                <strong>III. {"Stored Energy" if lang=="en" else "Énergie Emmagasinée"}</strong> (1. {"Formula E_e = 0.5 C u_C²" if lang=="en" else "Formule E_e = 0,5 C u_C²"}, 2. {"Flash lamp discharge" if lang=="en" else "Décharge dans une lampe"})
                            </td>
                            <td>
                                <ul>
                                    <li>{"Capacitor decade boxes (1 µF to 100 µF), variable resistors" if lang=="en" else "Boîtes de condensateurs et résistances à décades"}</li>
                                    <li>{"DC power supply (6V, 12V), square-wave generator (GBF)" if lang=="en" else "Alimentation continue, générateur GBF"}</li>
                                    <li>{"Digital storage oscilloscope / PC data acquisition interface" if lang=="en" else "Oscilloscope numérique à mémoire / carte d'acquisition"}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>{"Activities:" if lang=="en" else "Activités :"}</strong> {"Display charge/discharge curves on oscilloscope; determine τ using origin tangent; verify dimensional analysis of [τ] = [T]." if lang=="en" else "Visualisation de u_C(t) à l'oscilloscope ; mesure de τ par tangente et à 63% ; analyse dimensionnelle de τ."}<br>
                                <strong>{"Evaluation:" if lang=="en" else "Évaluation :"}</strong> {"Differential equation solutions and energy calculations; Exam 2." if lang=="en" else "Résolution d'équations différentielles et Devoir surveillé 2."}
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

    # ---------------- PAGE 6: ELECTRICITY UNITS 2 & 3 (RL & RLC) ----------------
    p6 = f"""
    <div class="page">
        <div>
            {render_official_header("2BAC Sciences", "Physics Component" if lang=="en" else "Composante Physique", 5, lang)}
            
            <!-- UNIT 2 -->
            <div class="unit-block">
                <div class="unit-banner">
                    <span>{"Unit 2: The RL Dipole" if lang=="en" else "Unité 2 : Le Dipôle RL"}</span>
                    <span>6 {"Hours" if lang=="en" else "Heures"}</span>
                </div>
                <div class="unit-prereq-problem">
                    <div class="prereq-col">
                        <div class="block-title">{"Prerequisites:" if lang=="en" else "Prérequis :"}</div>
                        {"Ohm's law, RC circuit, magnetic field, oscilloscope." if lang=="en" else "Loi d'Ohm, circuit RC, champ magnétique, oscilloscope."}
                    </div>
                    <div class="problem-col">
                        <div class="block-title">{"Problem Situation:" if lang=="en" else "Situation-Problème :"}</div>
                        {"Coils oppose sudden current changes, producing high inductive voltages. What is a coil, what is inductance L, and how does current establish?" if lang=="en" else "Une bobine s'oppose aux variations brutales de courant en créant une surtension. Qu'est-ce que l'inductance L et la constante de temps ?" }
                    </div>
                </div>
                <table class="pedagogical-table">
                    <thead><tr><th style="width:25%;">{"Objectives" if lang=="en" else "Objectifs"}</th><th style="width:25%;">{"Contents" if lang=="en" else "Contenus"}</th><th style="width:25%;">{"Didactic Materials" if lang=="en" else "Matériel Didactique"}</th><th style="width:25%;">{"Activities & Evaluation" if lang=="en" else "Activités & Évaluation"}</th></tr></thead>
                    <tbody>
                        <tr>
                            <td>
                                <ul>
                                    <li>{"Coil voltage equation: u_L(t) = L · (di/dt) + r · i." if lang=="en" else "Tension aux bornes de la bobine : u_L = L(di/dt) + r·i."}</li>
                                    <li>{"Inductance L in Henries (H); internal resistance r (Ω)." if lang=="en" else "Inductance L en Henries (H) et résistance r."}</li>
                                    <li>{"Differential equation for current setup: L·(di/dt) + (R+r)·i = E." if lang=="en" else "Équation différentielle d'établissement du courant."}</li>
                                    <li>{"Time constant: τ = L / (R + r) (seconds)." if lang=="en" else "Constante de temps : τ = L / (R + r)."}</li>
                                    <li>{"Magnetic energy stored: E_m = 0.5 · L · i² (Joules)." if lang=="en" else "Énergie magnétique emmagasinée : E_m = 0,5 · L · i²."}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>I. {"The Inductor Coil" if lang=="en" else "La Bobine"}</strong> (1. {"Description" if lang=="en" else "Description"}, 2. {"Voltage u_L = L·di/dt + r·i" if lang=="en" else "Tension u_L"}, 3. {"Measurement of L and r" if lang=="en" else "Mesure de L et r"})<br>
                                <strong>II. {"RL Transient Response" if lang=="en" else "Réponse à un Échelon"}</strong> (1. {"Current establishment" if lang=="en" else "Établissement du courant"}, 2. {"Differential equation" if lang=="en" else "Équation différentielle"}, 3. {"Time constant τ = L/R_tot" if lang=="en" else "Constante de temps τ"}, 4. {"Current break & diode freewheeling" if lang=="en" else "Rupture du courant"})<br>
                                <strong>III. {"Magnetic Energy" if lang=="en" else "Énergie Magnétique"}</strong> (1. {"Formula E_m = 0.5 L i²" if lang=="en" else "Formule E_m = 0,5 L i²"})
                            </td>
                            <td>
                                <ul>
                                    <li>{"Inductor coils with iron core, resistors" if lang=="en" else "Bobines à noyau de fer doux, boîtes de résistances"}</li>
                                    <li>{"Diode (for freewheeling protection)" if lang=="en" else "Diode de roue libre"}</li>
                                    <li>{"Square-wave generator GBF, oscilloscope, computer interface" if lang=="en" else "Générateur GBF, oscilloscope à mémoire"}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>{"Activities:" if lang=="en" else "Activités :"}</strong> {"Observe delayed current establishment on oscilloscope; determine τ; measure coil inductance L and internal resistance r." if lang=="en" else "Visualisation du retard à l'établissement du courant ; mesure de τ et déduction de L."}<br>
                                <strong>{"Evaluation:" if lang=="en" else "Évaluation :"}</strong> {"RL differential equations and dimensional analysis tests." if lang=="en" else "Exercices sur le dipôle RL et Devoir surveillé 2."}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- UNIT 3 -->
            <div class="unit-block">
                <div class="unit-banner">
                    <span>{"Unit 3: Free Oscillations in a Series RLC Circuit" if lang=="en" else "Unité 3 : Oscillations Libres dans un Circuit RLC Série"}</span>
                    <span>8 {"Hours" if lang=="en" else "Heures"}</span>
                </div>
                <div class="unit-prereq-problem">
                    <div class="prereq-col">
                        <div class="block-title">{"Prerequisites:" if lang=="en" else "Prérequis :"}</div>
                        {"RC and RL dipoles, differential equations, energy." if lang=="en" else "Dipôles RC et RL, équations différentielles, énergie."}
                    </div>
                    <div class="problem-col">
                        <div class="block-title">{"Problem Situation:" if lang=="en" else "Situation-Problème :"}</div>
                        {"Radio transmitters and receivers contain electrical oscillators. How do RLC circuits oscillate, why do they damp out, and how are oscillations sustained?" if lang=="en" else "Les émetteurs et récepteurs radio utilisent des oscillateurs. Comment le circuit RLC oscille-t-il et comment entretenir ces oscillations ?" }
                    </div>
                </div>
                <table class="pedagogical-table">
                    <thead><tr><th style="width:25%;">{"Objectives" if lang=="en" else "Objectifs"}</th><th style="width:25%;">{"Contents" if lang=="en" else "Contenus"}</th><th style="width:25%;">{"Didactic Materials" if lang=="en" else "Matériel Didactique"}</th><th style="width:25%;">{"Activities & Evaluation" if lang=="en" else "Activités & Évaluation"}</th></tr></thead>
                    <tbody>
                        <tr>
                            <td>
                                <ul>
                                    <li>{"Three oscillation regimes: pseudoperiodic, aperiodic, critical." if lang=="en" else "Régimes pseudopériodique, apériodique et critique."}</li>
                                    <li>{"Ideal LC circuit differential equation: d²u_C/dt² + (1/LC)·u_C = 0." if lang=="en" else "Circuit LC idéal : d²u_C/dt² + (1/LC)·u_C = 0."}</li>
                                    <li>{"Natural period: T₀ = 2π · √(L · C) (seconds)." if lang=="en" else "Période propre : T₀ = 2π · √(L · C)."}</li>
                                    <li>{"Total energy exchange: E_T = E_e + E_m and Joule dissipation." if lang=="en" else "Énergie totale E_T = E_e + E_m et dissipation Joule."}</li>
                                    <li>{"Sustaining oscillations using an op-amp negative resistance converter." if lang=="en" else "Entretien des oscillations par résistance négative (AOP)."}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>I. {"Capacitor Discharge through Coil" if lang=="en" else "Décharge dans une Bobine"}</strong> (1. {"RLC circuit setup" if lang=="en" else "Montage RLC"}, 2. {"Three damping regimes" if lang=="en" else "Trois régimes d'amortissement"})<br>
                                <strong>II. {"Analytical Study of Undamped LC Circuit" if lang=="en" else "Étude Analytique (LC)"}</strong> (1. {"Differential equation" if lang=="en" else "Équation différentielle"}, 2. {"Solution u_C(t) = U_m·cos(2πt/T₀ + φ)" if lang=="en" else "Solution sinusoïdale"}, 3. {"Period T₀ = 2π√(LC)" if lang=="en" else "Période propre T₀"})<br>
                                <strong>III. {"Energy Exchanges & Maintenance" if lang=="en" else "Énergie & Entretien"}</strong> (1. {"Energy transfer curves" if lang=="en" else "Échanges d'énergie"}, 2. {"Active maintenance" if lang=="en" else "Entretien par AOP"})
                            </td>
                            <td>
                                <ul>
                                    <li>{"Inductor coils, capacitor decade box, resistance box" if lang=="en" else "Bobines, boîtes de condensateurs et résistances"}</li>
                                    <li>{"Operational amplifier (741) maintenance circuit with ±15V supply" if lang=="en" else "Montage d'entretien à AOP (résistance négative)"}</li>
                                    <li>{"Digital oscilloscope, interface and software (Regressi)" if lang=="en" else "Oscilloscope numérique et logiciel Regressi"}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>{"Activities:" if lang=="en" else "Activités :"}</strong> {"Display pseudoperiodic oscillations; verify T ≈ T₀ = 2π√(LC). Connect negative resistance circuit to observe sustained undamped sine wave." if lang=="en" else "Mesure de la pseudopériode T ; vérification de T₀ ; observation des oscillations entretenues à l'AOP."}<br>
                                <strong>{"Evaluation:" if lang=="en" else "Évaluation :"}</strong> {"RLC energy dissipation calculations and Supervised Exam 3." if lang=="en" else "Exercices de bilan énergétique RLC et Devoir surveillé 3."}
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

    # ---------------- PAGE 7: ELECTRICITY UNITS 4 & 5 (SM) ----------------
    p7 = f"""
    <div class="page">
        <div>
            {render_official_header("2BAC Sciences", "Physics Component" if lang=="en" else "Composante Physique", 6, lang)}
            <div class="overview-box">
                <div class="overview-title">{"Part 3: Electricity • Units 4 & 5 (Mathematical Sciences Stream)" if lang=="en" else "Partie 3 : Électricité • Unités 4 & 5 (Filière Sciences Mathématiques)"}</div>
            </div>

            <!-- UNIT 4 -->
            <div class="unit-block">
                <div class="unit-banner">
                    <span>{"Unit 4: Forced Oscillations in a Series RLC Circuit (SM)" if lang=="en" else "Unité 4 : Oscillations Électriques Forcées dans un Circuit RLC (SM)"}</span>
                    <span>8 {"Hours" if lang=="en" else "Heures"}</span>
                </div>
                <div class="unit-prereq-problem">
                    <div class="prereq-col">
                        <div class="block-title">{"Prerequisites:" if lang=="en" else "Prérequis :"}</div>
                        {"Series RLC circuit, AC sinusoidal signals, phase difference." if lang=="en" else "Circuit RLC, signaux sinusoïdaux, déphasage."}
                    </div>
                    <div class="problem-col">
                        <div class="block-title">{"Problem Situation:" if lang=="en" else "Situation-Problème :"}</div>
                        {"Tuning a radio selects one exact frequency among thousands. What is electrical resonance and impedance in forced RLC circuits?" if lang=="en" else "Accorder un récepteur radio sélectionne une fréquence parmi des milliers. Qu'est-ce que la résonance électrique et l'impédance ?"}
                    </div>
                </div>
                <table class="pedagogical-table">
                    <thead><tr><th style="width:25%;">{"Objectives" if lang=="en" else "Objectifs"}</th><th style="width:25%;">{"Contents" if lang=="en" else "Contenus"}</th><th style="width:25%;">{"Didactic Materials" if lang=="en" else "Matériel Didactique"}</th><th style="width:25%;">{"Activities & Evaluation" if lang=="en" else "Activités & Évaluation"}</th></tr></thead>
                    <tbody>
                        <tr>
                            <td>
                                <ul>
                                    <li>{"Exciter (GBF generator) and resonator (RLC circuit)." if lang=="en" else "Excitateur (générateur GBF) et résonateur (RLC)."}</li>
                                    <li>{"Circuit electrical impedance: Z = U_m / I_m = √(R_tot² + (Lω - 1/Cω)²)." if lang=="en" else "Impédance : Z = √(R_tot² + (Lω - 1/Cω)²)."}</li>
                                    <li>{"Electrical current resonance: ω₀ = 1/√(LC) ⇒ N₀ = 1/(2π√(LC))." if lang=="en" else "Résonance d'intensité : N₀ = 1/(2π√(LC))."}</li>
                                    <li>{"Resonance bandwidth at -3dB: ΔN = N₂ - N₁ = R_tot / (2π·L)." if lang=="en" else "Bande passante à -3dB : ΔN = R_tot / (2π·L)."}</li>
                                    <li>{"Quality factor: Q = N₀ / ΔN = L·ω₀ / R_tot." if lang=="en" else "Facteur de qualité : Q = N₀ / ΔN."}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>I. {"Forced Oscillations" if lang=="en" else "Oscillations Forcées"}</strong> (1. {"Exciter & resonator" if lang=="en" else "Excitateur et résonateur"}, 2. {"Impedance Z" if lang=="en" else "Impédance Z"}, 3. {"Phase shift φ" if lang=="en" else "Déphasage φ"})<br>
                                <strong>II. {"Current Resonance" if lang=="en" else "Résonance d'Intensité"}</strong> (1. {"Resonance condition Lω = 1/Cω" if lang=="en" else "Condition de résonance"}, 2. {"Resonance curve I(N)" if lang=="en" else "Courbe de résonance"}, 3. {"Bandwidth ΔN & Quality Q" if lang=="en" else "Bande passante et facteur Q"})
                            </td>
                            <td>
                                <ul>
                                    <li>{"Variable frequency sine generator (GBF 10 Hz - 100 kHz)" if lang=="en" else "Générateur GBF sinusoïdal réglable"}</li>
                                    <li>{"Inductor coil, capacitor, calibrated resistors" if lang=="en" else "Bobine d'inductance, condensateur, résistances"}</li>
                                    <li>{"Dual-trace oscilloscope and digital AC multimeter" if lang=="en" else "Oscilloscope bicourbe et multimètre efficace"}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>{"Activities:" if lang=="en" else "Activités :"}</strong> {"Plot current I_m vs frequency N; find resonance peak N₀; measure bandwidth at I_m/√2 and compute quality factor Q." if lang=="en" else "Tracé de la courbe I(N) ; repérage du pic de résonance N₀ ; calcul de la bande passante et du facteur Q."}<br>
                                <strong>{"Evaluation:" if lang=="en" else "Évaluation :"}</strong> {"Impedance and resonance bandwidth calculations." if lang=="en" else "Exercices d'impédance et calculs de résonance."}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- UNIT 5 -->
            <div class="unit-block">
                <div class="unit-banner">
                    <span>{"Unit 5: Production of Electromagnetic Waves & Communication (SM)" if lang=="en" else "Unité 5 : Production d'Ondes Électromagnétiques et Modulation (SM)"}</span>
                    <span>10 {"Hours" if lang=="en" else "Heures"}</span>
                </div>
                <div class="unit-prereq-problem">
                    <div class="prereq-col">
                        <div class="block-title">{"Prerequisites:" if lang=="en" else "Prérequis :"}</div>
                        {"AC voltages, resonance, RLC circuits, multiplier circuit." if lang=="en" else "Tensions alternatives, résonance, circuit multiplieur."}
                    </div>
                    <div class="problem-col">
                        <div class="block-title">{"Problem Situation:" if lang=="en" else "Situation-Problème :"}</div>
                        {"Radio antennas transmit information across thousands of kilometers. Why is high-frequency carrier modulation required, and how is AM demodulated?" if lang=="en" else "Les antennes émettent des signaux sur de grandes distances. Pourquoi moduler une onde porteuse et comment démoduler le signal ?" }
                    </div>
                </div>
                <table class="pedagogical-table">
                    <thead><tr><th style="width:25%;">{"Objectives" if lang=="en" else "Objectifs"}</th><th style="width:25%;">{"Contents" if lang=="en" else "Contenus"}</th><th style="width:25%;">{"Didactic Materials" if lang=="en" else "Matériel Didactique"}</th><th style="width:25%;">{"Activities & Evaluation" if lang=="en" else "Activités & Évaluation"}</th></tr></thead>
                    <tbody>
                        <tr>
                            <td>
                                <ul>
                                    <li>{"Principle of Amplitude Modulation (AM): carrier p(t) and signal s(t)." if lang=="en" else "Modulation d'amplitude (AM) : porteuse p(t) et signal s(t)."}</li>
                                    <li>{"Modulated voltage: u(t) = k · [s(t) + U₀] · p(t) = A · [1 + m · cos(2π·f_s·t)] · cos(2π·F_p·t)." if lang=="en" else "Tension modulée : u(t) = A[1 + m·cos(2π f_s t)]·cos(2π F_p t)."}</li>
                                    <li>{"Modulation rate: m = (U_max - U_min) / (U_max + U_min) < 1 for good modulation." if lang=="en" else "Taux de modulation : m = (U_max - U_min)/(U_max + U_min) < 1."}</li>
                                    <li>{"Trapezoidal method for checking modulation quality." if lang=="en" else "Méthode du trapèze en mode XY."}</li>
                                    <li>{"Demodulation: diode envelope detector (R·C condition: T_p ≪ τ ≪ T_s)." if lang=="en" else "Démodulation : détecteur d'enveloppe (T_p ≪ RC ≪ T_s)."}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>I. {"Need for Modulation" if lang=="en" else "Nécessité de la Modulation"}</strong> (1. {"Antenna dimension problem" if lang=="en" else "Dimension des antennes"}, 2. {"Frequency multiplexing" if lang=="en" else "Multiplexage"})<br>
                                <strong>II. {"Amplitude Modulation (AM)" if lang=="en" else "Modulation d'Amplitude"}</strong> (1. {"Multiplier circuit" if lang=="en" else "Circuit multiplieur"}, 2. {"Modulation rate m" if lang=="en" else "Taux m"}, 3. {"Trapezoidal check in XY mode" if lang=="en" else "Méthode du trapèze"})<br>
                                <strong>III. {"Demodulation" if lang=="en" else "Démodulation"}</strong> (1. {"Envelope detection" if lang=="en" else "Détection d'enveloppe"}, 2. {"Elimination of DC component" if lang=="en" else "Filtre passe-haut"})
                            </td>
                            <td>
                                <ul>
                                    <li>{"Analog multiplier IC (AD633), two GBF generators" if lang=="en" else "Circuit multiplieur analogique AD633, 2 générateurs GBF"}</li>
                                    <li>{"Signal diode (1N4148), RC filter components, loudspeaker" if lang=="en" else "Diode 1N4148, composants RC de démodulation, haut-parleur"}</li>
                                    <li>{"Dual-channel oscilloscope with XY display mode" if lang=="en" else "Oscilloscope bicourbe en mode XY"}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>{"Activities:" if lang=="en" else "Activités :"}</strong> {"Modulate low-frequency sound on 20 kHz carrier; display trapezoid in XY mode; tune envelope detector RC filter to recover audio." if lang=="en" else "Modulation avec AD633 ; affichage du trapèze en XY ; démodulation et écoute sur haut-parleur."}<br>
                                <strong>{"Evaluation:" if lang=="en" else "Évaluation :"}</strong> {"Modulation rate calculations and filter condition problems." if lang=="en" else "Calculs de taux m et Devoir surveillé 3."}
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

    # ---------------- PAGE 8: MECHANICS UNITS 1 & 2 ----------------
    p8 = f"""
    <div class="page">
        <div>
            {render_official_header("2BAC Sciences", "Physics Component" if lang=="en" else "Composante Physique", 7, lang)}
            <div class="overview-box">
                <div class="overview-title">{"Part 4: Mechanics (Total: 35 - 47 Hours) • Units 1 & 2: Newton's Laws & Vertical Fall" if lang=="en" else "Partie 4 : La Mécanique (35 - 47 Heures) • Unités 1 & 2 : Lois de Newton & Chute Verticale"}</div>
                <div class="overview-grid">
                    <div>
                        <strong>{"Competencies:" if lang=="en" else "Compétences Visées :"}</strong>
                        {"Apply Newton's laws to predict kinematics and dynamics of solids. Prevent traffic accidents. Use numerical integration (Euler's method). Model everyday mechanics." if lang=="en" else "Appliquer les lois de Newton pour prédire trajectoires et vitesses. Prévention routière. Méthode numérique d'Euler. Modélisation de systèmes réels."}
                    </div>
                    <div>
                        <strong>{"Part Units:" if lang=="en" else "Unités de la Partie :"}</strong>
                        1. {"Newton's Laws (5-6h)" if lang=="en" else "Lois de Newton (5-6h)"} • 
                        2. {"Vertical Fall (3-5h)" if lang=="en" else "Chute verticale (3-5h)"} • 
                        3. {"Planar Motions (4-5h)" if lang=="en" else "Mouvements plans (4-5h)"} • 
                        4. {"Satellites & Planets (5h - SM)" if lang=="en" else "Satellites et planètes (5h - SM)"} • 
                        5. {"Rotation Dynamics (6h - SM)" if lang=="en" else "Dynamique de rotation (6h - SM)"} • 
                        6. {"Mechanical Oscillators (8-11h)" if lang=="en" else "Oscillateurs mécaniques (8-11h)"} • 
                        7. {"Energy Aspects (4-5h)" if lang=="en" else "Aspects énergétiques (4-5h)"} • 
                        8. {"Atom & Mechanics (5h - SM)" if lang=="en" else "L'atome et la mécanique (5h - SM)"}
                    </div>
                </div>
            </div>

            <!-- UNIT 1 -->
            <div class="unit-block">
                <div class="unit-banner">
                    <span>{"Unit 1: Newton's Laws" if lang=="en" else "Unité 1 : Les Lois de Newton"}</span>
                    <span>6 {"Hours" if lang=="en" else "Heures"}</span>
                </div>
                <div class="unit-prereq-problem">
                    <div class="prereq-col">
                        <div class="block-title">{"Prerequisites:" if lang=="en" else "Prérequis :"}</div>
                        {"Vectors, velocity, acceleration, inertia principle, Galileo frames." if lang=="en" else "Vecteurs, vitesse, accélération, principe d'inertie, repères galiléens."}
                    </div>
                    <div class="problem-col">
                        <div class="block-title">{"Problem Situation:" if lang=="en" else "Situation-Problème :"}</div>
                        {"Isaac Newton linked forces acting on a body to the motion of its center of mass. What are Newton's three laws and how do they predict motion on inclined planes?" if lang=="en" else "Isaac Newton relia les forces au mouvement du centre d'inertie. Quelles sont les trois lois de Newton et comment décrivent-elles le mouvement ?"}
                    </div>
                </div>
                <table class="pedagogical-table">
                    <thead><tr><th style="width:25%;">{"Objectives" if lang=="en" else "Objectifs"}</th><th style="width:25%;">{"Contents" if lang=="en" else "Contenus"}</th><th style="width:25%;">{"Didactic Materials" if lang=="en" else "Matériel Didactique"}</th><th style="width:25%;">{"Activities & Evaluation" if lang=="en" else "Activités & Évaluation"}</th></tr></thead>
                    <tbody>
                        <tr>
                            <td>
                                <ul>
                                    <li>{"Acceleration vector a = dv/dt = d²r/dt²." if lang=="en" else "Vecteur accélération a = dv/dt = d²r/dt²."}</li>
                                    <li>{"Frenet frame components: a = a_t · u_t + a_n · u_n = (dv/dt)·u_t + (v²/ρ)·u_n." if lang=="en" else "Repère de Frenet : a_t = dv/dt et a_n = v²/ρ."}</li>
                                    <li>{"Newton's 1st Law (Inertia), 2nd Law (ΣF_ext = m · a_G), 3rd Law (Action-Reaction)." if lang=="en" else "Trois lois de Newton (1ère, 2ème ΣF = m·a_G, 3ème F_A/B = -F_B/A)."}</li>
                                    <li>{"Galilean reference frames and validity conditions." if lang=="en" else "Référentiels galiléens."}</li>
                                    <li>{"Study motion of a solid on horizontal and inclined planes." if lang=="en" else "Étude sur plan horizontal et plan incliné."}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>I. {"Kinematics Vectors" if lang=="en" else "Cinématique"}</strong> (1. {"Position & velocity" if lang=="en" else "Vecteurs position et vitesse"}, 2. {"Acceleration vector" if lang=="en" else "Vecteur accélération"}, 3. {"Frenet frame" if lang=="en" else "Repère de Frenet"})<br>
                                <strong>II. {"Newton's Laws" if lang=="en" else "Lois de Newton"}</strong> (1. {"Newton's 1st Law" if lang=="en" else "1ère loi d'inertie"}, 2. {"Newton's 2nd Law ΣF = m·a_G" if lang=="en" else "2ème loi fondamentale"}, 3. {"Newton's 3rd Law" if lang=="en" else "3ème loi d'action-réaction"})<br>
                                <strong>III. {"Applications" if lang=="en" else "Applications"}</strong> (1. {"Horizontal plane" if lang=="en" else "Plan horizontal"}, 2. {"Inclined plane motion" if lang=="en" else "Plan incliné"})
                            </td>
                            <td>
                                <ul>
                                    <li>{"Linear air track with optical photogates" if lang=="en" else "Banc à coussin d'air et fourches optiques"}</li>
                                    <li>{"Glider, calibrated traction masses, friction pads" if lang=="en" else "Mobile autoporteur, masses tractrices, patins"}</li>
                                    <li>{"Computer with Avimeca motion analysis software" if lang=="en" else "Ordinateur avec logiciel Avimeca / Regressi"}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>{"Activities:" if lang=="en" else "Activités :"}</strong> {"Verify a_G = F/m on air track. Project Newton's 2nd law along axes to compute friction coefficient." if lang=="en" else "Vérification de a_G = F/m sur banc d'air et calcul du coefficient de frottement."}<br>
                                <strong>{"Evaluation:" if lang=="en" else "Évaluation :"}</strong> {"Inclined plane acceleration problems and Exam 4." if lang=="en" else "Exercices de dynamique sur plan incliné et Devoir 4."}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- UNIT 2 -->
            <div class="unit-block">
                <div class="unit-banner">
                    <span>{"Unit 2: Vertical Fall of a Solid Body" if lang=="en" else "Unité 2 : Chute Verticale d'un Corps Solide"}</span>
                    <span>4 {"Hours" if lang=="en" else "Heures"}</span>
                </div>
                <div class="unit-prereq-problem">
                    <div class="prereq-col">
                        <div class="block-title">{"Prerequisites:" if lang=="en" else "Prérequis :"}</div>
                        {"Gravity field, Newton's 2nd law, integration." if lang=="en" else "Champ de pesanteur, 2ème loi de Newton, intégration."}
                    </div>
                    <div class="problem-col">
                        <div class="block-title">{"Problem Situation:" if lang=="en" else "Situation-Problème :"}</div>
                        {"A parachutist accelerates before reaching a constant terminal velocity. What distinguishes free fall from fall in a fluid, and how does Euler's method solve it?" if lang=="en" else "Le parachutiste accélère puis atteint une vitesse limite. Comment modéliser la chute avec frottement fluide et appliquer la méthode d'Euler ?"}
                    </div>
                </div>
                <table class="pedagogical-table">
                    <thead><tr><th style="width:25%;">{"Objectives" if lang=="en" else "Objectifs"}</th><th style="width:25%;">{"Contents" if lang=="en" else "Contenus"}</th><th style="width:25%;">{"Didactic Materials" if lang=="en" else "Matériel Didactique"}</th><th style="width:25%;">{"Activities & Evaluation" if lang=="en" else "Activités & Évaluation"}</th></tr></thead>
                    <tbody>
                        <tr>
                            <td>
                                <ul>
                                    <li>{"Free fall: only force is weight (a = g, v(t) = g·t, z(t) = 0.5·g·t²)." if lang=="en" else "Chute libre : soumis uniquement au poids (a = g)."}</li>
                                    <li>{"Fall in fluid: weight P, Archimedes thrust F_A, and fluid friction f = -k·v^n." if lang=="en" else "Chute visqueuse : poids P, poussée F_A et frottement fluide f = -k·v^n."}</li>
                                    <li>{"Differential equation: dv/dt = A - B · v (or v²)." if lang=="en" else "Équation différentielle : dv/dt = A - B·v."}</li>
                                    <li>{"Terminal velocity: v_lim = A / B when dv/dt = 0." if lang=="en" else "Vitesse limite : v_lim = A / B."}</li>
                                    <li>{"Euler's numerical method: v_(i+1) = v_i + a_i · Δt and a_i = A - B · v_i." if lang=="en" else "Méthode numérique d'Euler : v_(i+1) = v_i + a_i·Δt."}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>I. {"Free Fall" if lang=="en" else "La Chute Libre"}</strong> (1. {"Definition" if lang=="en" else "Définition"}, 2. {"Differential equation a = g" if lang=="en" else "Équation a = g"}, 3. {"Time equations" if lang=="en" else "Équations horaires"})<br>
                                <strong>II. {"Fall with Fluid Friction" if lang=="en" else "Chute avec Frottement Fluide"}</strong> (1. {"Forces acting: P, F_A, f" if lang=="en" else "Bilan des forces"}, 2. {"Differential equation dv/dt = A - B·v" if lang=="en" else "Équation différentielle"}, 3. {"Terminal speed v_lim" if lang=="en" else "Vitesse limite v_lim"}, 4. {"Characteristic time τ" if lang=="en" else "Temps caractéristique τ"})<br>
                                <strong>III. {"Euler's Numerical Method" if lang=="en" else "Méthode Numérique d'Euler"}</strong>
                            </td>
                            <td>
                                <ul>
                                    <li>{"Tall glass cylinder filled with pure glycerol" if lang=="en" else "Grande éprouvette graduée remplie de glycérol"}</li>
                                    <li>{"Steel bearing balls of varied diameters" if lang=="en" else "Billes d'acier de différents diamètres"}</li>
                                    <li>{"Digital camera, lighting screen, Avimeca and Regressi" if lang=="en" else "Caméra numérique, logiciel Avimeca et tableur Regressi"}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>{"Activities:" if lang=="en" else "Activités :"}</strong> {"Film ball drop in glycerol; plot v(t); observe asymptotic approach to v_lim. Compute 5 steps of Euler table and compare with experiment." if lang=="en" else "Filmer la chute d'une bille dans le glycérol ; tracé de v(t) ; calcul itératif d'Euler et comparaison."}<br>
                                <strong>{"Evaluation:" if lang=="en" else "Évaluation :"}</strong> {"Euler table iterations and terminal velocity problems." if lang=="en" else "Calculs sur tableau d'Euler et Devoir surveillé 4."}
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

    # ---------------- PAGE 9: MECHANICS UNITS 3 & 4 (PLANAR & SATELLITES) ----------------
    p9 = f"""
    <div class="page">
        <div>
            {render_official_header("2BAC Sciences", "Physics Component" if lang=="en" else "Composante Physique", 8, lang)}
            
            <!-- UNIT 3 -->
            <div class="unit-block">
                <div class="unit-banner">
                    <span>{"Unit 3: Planar Motions - Projectiles and Charged Particles" if lang=="en" else "Unité 3 : Mouvements Plans - Projectiles et Particules Chargées"}</span>
                    <span>5 {"Hours" if lang=="en" else "Heures"}</span>
                </div>
                <div class="unit-prereq-problem">
                    <div class="prereq-col">
                        <div class="block-title">{"Prerequisites:" if lang=="en" else "Prérequis :"}</div>
                        {"Newton's 2nd law, vectors, uniform electric/magnetic fields." if lang=="en" else "2ème loi de Newton, vecteurs, champs électrique et magnétique."}
                    </div>
                    <div class="problem-col">
                        <div class="block-title">{"Problem Situation:" if lang=="en" else "Situation-Problème :"}</div>
                        {"In soccer penalty kicks, initial velocity and launch angle decide whether a goal is scored. How does initial velocity govern parabolic trajectory, peak, and range?" if lang=="en" else "La vitesse initiale et l'angle de tir déterminent la portée d'un ballon. Quelles équations régissent la parabole et sa flèche ?"}
                    </div>
                </div>
                <table class="pedagogical-table">
                    <thead><tr><th style="width:25%;">{"Objectives" if lang=="en" else "Objectifs"}</th><th style="width:25%;">{"Contents" if lang=="en" else "Contenus"}</th><th style="width:25%;">{"Didactic Materials" if lang=="en" else "Matériel Didactique"}</th><th style="width:25%;">{"Activities & Evaluation" if lang=="en" else "Activités & Évaluation"}</th></tr></thead>
                    <tbody>
                        <tr>
                            <td>
                                <ul>
                                    <li>{"Projectile parametric equations: x(t) = (v₀·cosα)·t, y(t) = -0.5g·t² + (v₀·sinα)·t." if lang=="en" else "Équations horaires du projectile."}</li>
                                    <li>{"Trajectory parabola: y(x) = -(g / (2v₀²·cos²α))·x² + tan(α)·x." if lang=="en" else "Équation de trajectoire y(x)."}</li>
                                    <li>{"Calculate trajectory peak (flèche) and impact range (portée)." if lang=="en" else "Calcul de la flèche et de la portée."}</li>
                                    <li>{"Charged particle in magnetic field: Lorentz force F = q(v × B); circular uniform motion of radius R = m·v / (|q|·B)." if lang=="en" else "Particule dans champ magnétique : force de Lorentz et rayon R = m·v / (|q|·B)."}</li>
                                    <li>{"Charged particle in uniform electric field: parabolic deflection." if lang=="en" else "Déviation dans un champ électrostatique."}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>I. {"Projectile Motion" if lang=="en" else "Mouvement d'un Projectile"}</strong> (1. {"Newton's 2nd law application" if lang=="en" else "Application de la 2ème loi"}, 2. {"Parametric equations" if lang=="en" else "Équations horaires"}, 3. {"Cartesian trajectory" if lang=="en" else "Trajectoire"}, 4. {"Range & peak" if lang=="en" else "Portée et flèche"})<br>
                                <strong>II. {"Charged Particle in Uniform B" if lang=="en" else "Particule dans un Champ B"}</strong> (1. {"Lorentz magnetic force" if lang=="en" else "Force de Lorentz"}, 2. {"Proof of uniform circular motion" if lang=="en" else "Mouvement circulaire uniforme"}, 3. {"Magnetic deflection" if lang=="en" else "Déviation magnétique"})<br>
                                <strong>III. {"Charged Particle in Uniform E" if lang=="en" else "Particule dans un Champ E"}</strong>
                            </td>
                            <td>
                                <ul>
                                    <li>{"Spring cannon projectile launcher with angle scale" if lang=="en" else "Lanceur de projectiles à ressort avec inclinaison"}</li>
                                    <li>{"Fine electron beam deflection tube with Helmholtz coils" if lang=="en" else "Tube à déviation d'électrons avec bobines de Helmholtz"}</li>
                                    <li>{"Video motion tracking software (Avimeca / Regressi)" if lang=="en" else "Logiciel de pointage vidéo Avimeca"}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>{"Activities:" if lang=="en" else "Activités :"}</strong> {"Shoot projectile at 30°, 45°, 60°; measure range; verify 45° gives maximum range. Observe circular glow of electron beam in B field." if lang=="en" else "Tir de projectile à divers angles et vérification de la portée maximale à 45°. Déviation circulaire du faisceau d'électrons."}<br>
                                <strong>{"Evaluation:" if lang=="en" else "Évaluation :"}</strong> {"Trajectory calculations, electron spectrometer problems, Exam 4." if lang=="en" else "Exercices de balistique et spectrométrie de masse."}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- UNIT 4 -->
            <div class="unit-block">
                <div class="unit-banner">
                    <span>{"Unit 4: Satellites and Planets (Mathematical Sciences)" if lang=="en" else "Unité 4 : Les Satellites et les Planètes (Sciences Mathématiques)"}</span>
                    <span>5 {"Hours" if lang=="en" else "Heures"}</span>
                </div>
                <div class="unit-prereq-problem">
                    <div class="prereq-col">
                        <div class="block-title">{"Prerequisites:" if lang=="en" else "Prérequis :"}</div>
                        {"Universal gravitation, circular motion, Frenet frame." if lang=="en" else "Gravitation universelle, mouvement circulaire, repère de Frenet."}
                    </div>
                    <div class="problem-col">
                        <div class="block-title">{"Problem Situation:" if lang=="en" else "Situation-Problème :"}</div>
                        {"The Moon orbits Earth every 27.3 days, while telecom satellites appear stationary. What are Kepler's three laws and what ensures geostationary orbit?" if lang=="en" else "La Lune orbite en 27,3 jours alors que les satellites météo semblent immobiles. Quelles sont les lois de Kepler et la condition géostationnaire ?"}
                    </div>
                </div>
                <table class="pedagogical-table">
                    <thead><tr><th style="width:25%;">{"Objectives" if lang=="en" else "Objectifs"}</th><th style="width:25%;">{"Contents" if lang=="en" else "Contenus"}</th><th style="width:25%;">{"Didactic Materials" if lang=="en" else "Matériel Didactique"}</th><th style="width:25%;">{"Activities & Evaluation" if lang=="en" else "Activités & Évaluation"}</th></tr></thead>
                    <tbody>
                        <tr>
                            <td>
                                <ul>
                                    <li>{"State Kepler's 3 laws (Ellipses, Equal Areas, Periods: T² / a³ = const)." if lang=="en" else "Trois lois de Kepler (orbites, aires, périodes T²/a³ = Cte)."}</li>
                                    <li>{"Study circular orbital motion in Frenet frame: a_n = v² / r." if lang=="en" else "Mouvement circulaire dans le repère de Frenet."}</li>
                                    <li>{"Orbital velocity: v = √(G · M / r)." if lang=="en" else "Vitesse orbitale : v = √(G·M / r)."}</li>
                                    <li>{"Orbital period: T = 2π · √(r³ / (G · M)) ⇒ T² / r³ = 4π² / (G · M)." if lang=="en" else "Période de révolution : T² / r³ = 4π² / (G·M)."}</li>
                                    <li>{"Geostationary satellite conditions (equatorial, West-to-East, T = 24h, h ≈ 36,000 km)." if lang=="en" else "Conditions du satellite géostationnaire (h ≈ 36 000 km)."}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>I. {"Kepler's Laws" if lang=="en" else "Lois de Kepler"}</strong> (1. {"Heliocentric frame" if lang=="en" else "Référentiel héliocentrique"}, 2. {"1st Law (Elliptical orbits)" if lang=="en" else "1ère loi des trajectoires"}, 3. {"2nd Law (Law of areas)" if lang=="en" else "2ème loi des aires"}, 4. {"3rd Law (Law of periods)" if lang=="en" else "3ème loi des périodes"})<br>
                                <strong>II. {"Circular Orbital Motion" if lang=="en" else "Mouvement Circulaire"}</strong> (1. {"Newton's 2nd law" if lang=="en" else "2ème loi de Newton"}, 2. {"Orbital velocity v" if lang=="en" else "Vitesse orbitale"}, 3. {"Period T" if lang=="en" else "Période T"})<br>
                                <strong>III. {"Artificial Satellites" if lang=="en" else "Satellites Artificiels"}</strong> (1. {"Geostationary satellite" if lang=="en" else "Satellite géostationnaire"})
                            </td>
                            <td>
                                <ul>
                                    <li>{"Astronomy planetarium simulation software (Stellarium)" if lang=="en" else "Logiciel de simulation astronomique Stellarium"}</li>
                                    <li>{"Planetary data tables (mass, radius, orbital semi-major axis, period)" if lang=="en" else "Tables astronomiques des planètes du système solaire"}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>{"Activities:" if lang=="en" else "Activités :"}</strong> {"Plot T² vs r³ for solar system planets; verify that slope equals 4π²/(G·M_Sun). Calculate exact altitude of geostationary orbit." if lang=="en" else "Tracé de T² en fonction de r³ pour les planètes et calcul de l'altitude géostationnaire."}<br>
                                <strong>{"Evaluation:" if lang=="en" else "Évaluation :"}</strong> {"Orbital mechanics problem sets and Exam 5." if lang=="en" else "Exercices de mécanique spatiale et Devoir surveillé 5."}
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

    # ---------------- PAGE 10: MECHANICS UNITS 5 & 6 (ROTATION & OSCILLATORS) ----------------
    p10 = f"""
    <div class="page">
        <div>
            {render_official_header("2BAC Sciences", "Physics Component" if lang=="en" else "Composante Physique", 9, lang)}
            
            <!-- UNIT 5 -->
            <div class="unit-block">
                <div class="unit-banner">
                    <span>{"Unit 5: Fundamental Dynamic Relation for Rotation (Mathematical Sciences)" if lang=="en" else "Unité 5 : Relation Fondamentale de la Dynamique de Rotation (SM)"}</span>
                    <span>6 {"Hours" if lang=="en" else "Heures"}</span>
                </div>
                <div class="unit-prereq-problem">
                    <div class="prereq-col">
                        <div class="block-title">{"Prerequisites:" if lang=="en" else "Prérequis :"}</div>
                        {"Angular acceleration, moment of force, moment of inertia." if lang=="en" else "Accélération angulaire, moment d'une force, moment d'inertie."}
                    </div>
                    <div class="problem-col">
                        <div class="block-title">{"Problem Situation:" if lang=="en" else "Situation-Problème :"}</div>
                        {"Waterwheels accelerate when water torque exceeds resistive forces. What quantitative law links net torque to angular acceleration θ''?" if lang=="en" else "La roue à aubes accélère sous l'effet du couple moteur de l'eau. Quelle relation relie la somme des moments à l'accélération angulaire ?"}
                    </div>
                </div>
                <table class="pedagogical-table">
                    <thead><tr><th style="width:25%;">{"Objectives" if lang=="en" else "Objectifs"}</th><th style="width:25%;">{"Contents" if lang=="en" else "Contenus"}</th><th style="width:25%;">{"Didactic Materials" if lang=="en" else "Matériel Didactique"}</th><th style="width:25%;">{"Activities & Evaluation" if lang=="en" else "Activités & Évaluation"}</th></tr></thead>
                    <tbody>
                        <tr>
                            <td>
                                <ul>
                                    <li>{"Angular acceleration: θ'' = dω/dt = d²θ/dt² (rad/s²)." if lang=="en" else "Accélération angulaire : θ'' = dω/dt = d²θ/dt² (rad/s²)."}</li>
                                    <li>{"Relation with linear acceleration: a_t = R · θ'' and a_n = R · θ'²." if lang=="en" else "Relations a_t = R·θ'' et a_n = R·θ'²."}</li>
                                    <li>{"Fundamental Relation for Rotation: Σ M_Δ(F_ext) = J_Δ · θ''." if lang=="en" else "Relation fondamentale : Σ M_Δ(F_ext) = J_Δ · θ''."}</li>
                                    <li>{"Moments of inertia for standard solids (disc, rod, cylinder, sphere)." if lang=="en" else "Moments d'inertie J_Δ des solides usuels."}</li>
                                    <li>{"Study mechanical systems with mixed translation and rotation." if lang=="en" else "Étude de systèmes couplés translation-rotation."}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>I. {"Angular Kinematics" if lang=="en" else "Cinématique Angulaire"}</strong> (1. {"Angular velocity and acceleration" if lang=="en" else "Vitesse et accélération angulaires"}, 2. {"Uniformly accelerated rotation: θ(t) = 0.5·θ''·t² + ω₀·t + θ₀" if lang=="en" else "Rotation uniformément variée"})<br>
                                <strong>II. {"Fundamental Dynamic Law" if lang=="en" else "Relation Fondamentale"}</strong> (1. {"Law statement ΣM = J_Δ·θ''" if lang=="en" else "Énoncé ΣM = J_Δ·θ''"}, 2. {"Moment of inertia J_Δ" if lang=="en" else "Moment d'inertie J_Δ"}, 3. {"Applications" if lang=="en" else "Applications"})
                            </td>
                            <td>
                                <ul>
                                    <li>{"Rotational dynamics bench with precision optical pulley" if lang=="en" else "Banc de dynamique de rotation avec poulie instrumentée"}</li>
                                    <li>{"Rotating disc, cylindrical ring, hanging acceleration mass" if lang=="en" else "Disque homogène, anneau cylindrique, masse motrice"}</li>
                                    <li>{"Electronic chronometer with infrared sensors" if lang=="en" else "Chronomètre numérique à barrières infrarouges"}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>{"Activities:" if lang=="en" else "Activités :"}</strong> {"Measure angular acceleration θ'' for varied falling masses; verify that θ'' is proportional to net torque and inversely proportional to J_Δ." if lang=="en" else "Mesure de θ'' en fonction du couple appliqué ; vérification de la proportionnalité avec J_Δ."}<br>
                                <strong>{"Evaluation:" if lang=="en" else "Évaluation :"}</strong> {"Dynamic rotation coupled problems and Exam 5." if lang=="en" else "Exercices de systèmes couplés et Devoir surveillé 5."}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- UNIT 6 -->
            <div class="unit-block">
                <div class="unit-banner">
                    <span>{"Unit 6: Oscillating Mechanical Systems" if lang=="en" else "Unité 6 : Les Systèmes Mécaniques Oscillants"}</span>
                    <span>8 {"Hours" if lang=="en" else "Heures"}</span>
                </div>
                <div class="unit-prereq-problem">
                    <div class="prereq-col">
                        <div class="block-title">{"Prerequisites:" if lang=="en" else "Prérequis :"}</div>
                        {"Newton's 2nd law, rotation dynamics, Hooke's law, torque." if lang=="en" else "2ème loi de Newton, dynamique de rotation, loi de Hooke."}
                    </div>
                    <div class="problem-col">
                        <div class="block-title">{"Problem Situation:" if lang=="en" else "Situation-Problème :"}</div>
                        {"In 1657, Huygens built the first pendulum clock. What characterizes mechanical harmonic oscillators (spring-mass, torsion, simple, physical)?" if lang=="en" else "En 1657, Huygens créa la première horloge à pendule. Comment caractériser les oscillateurs mécaniques (solide-ressort, torsion, pendule simple) ?"}
                    </div>
                </div>
                <table class="pedagogical-table">
                    <thead><tr><th style="width:25%;">{"Objectives" if lang=="en" else "Objectifs"}</th><th style="width:25%;">{"Contents" if lang=="en" else "Contenus"}</th><th style="width:25%;">{"Didactic Materials" if lang=="en" else "Matériel Didactique"}</th><th style="width:25%;">{"Activities & Evaluation" if lang=="en" else "Activités & Évaluation"}</th></tr></thead>
                    <tbody>
                        <tr>
                            <td>
                                <ul>
                                    <li>{"Elastic spring-mass oscillator: m·x'' + k·x = 0; period T₀ = 2π·√(m/k)." if lang=="en" else "Pendule élastique : m·x'' + k·x = 0 ; T₀ = 2π·√(m/k)."}</li>
                                    <li>{"Torsion pendulum: J_Δ·θ'' + C·θ = 0; period T₀ = 2π·√(J_Δ/C)." if lang=="en" else "Pendule de torsion : J_Δ·θ'' + C·θ = 0 ; T₀ = 2π·√(J_Δ/C)."}</li>
                                    <li>{"Simple gravity pendulum: θ'' + (g/L)·sin(θ) = 0; small angles T₀ = 2π·√(L/g)." if lang=="en" else "Pendule simple : θ'' + (g/L)·θ = 0 ; T₀ = 2π·√(L/g)."}</li>
                                    <li>{"Physical pendulum: J_Δ·θ'' + m·g·d·θ = 0; T₀ = 2π·√(J_Δ/(m·g·d))." if lang=="en" else "Pendule pesant : T₀ = 2π·√(J_Δ/(m·g·d))."}</li>
                                    <li>{"Damping regimes and mechanical resonance phenomenon." if lang=="en" else "Régimes d'amortissement et résonance mécanique."}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>I. {"Spring-Mass Oscillator" if lang=="en" else "Pendule Élastique"}</strong> (1. {"Differential equation" if lang=="en" else "Équation différentielle"}, 2. {"Harmonic solution x(t)" if lang=="en" else "Solution x(t)"}, 3. {"Period T₀ = 2π√(m/k)" if lang=="en" else "Période propre T₀"})<br>
                                <strong>II. {"Torsion Pendulum" if lang=="en" else "Pendule de Torsion"}</strong> (1. {"Equation J_Δ θ'' + C θ = 0" if lang=="en" else "Équation différentielle"}, 2. {"Period T₀ = 2π√(J_Δ/C)" if lang=="en" else "Période propre"})<br>
                                <strong>III. {"Gravity Pendulums" if lang=="en" else "Pendules Pesant et Simple"}</strong> (1. {"Simple pendulum T₀ = 2π√(L/g)" if lang=="en" else "Pendule simple"}, 2. {"Physical pendulum" if lang=="en" else "Pendule pesant"})<br>
                                <strong>IV. {"Damping & Resonance" if lang=="en" else "Amortissement et Résonance"}</strong>
                            </td>
                            <td>
                                <ul>
                                    <li>{"Horizontal air track with spring-mass glider" if lang=="en" else "Banc à air avec chariot à deux ressorts"}</li>
                                    <li>{"Torsion pendulum with metal bar and calibrated wire" if lang=="en" else "Pendule de torsion avec barre métallique et fil"}</li>
                                    <li>{"Simple pendulum apparatus with angle protractor, photogate timer" if lang=="en" else "Pendule simple avec fil et chronomètre optique"}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>{"Activities:" if lang=="en" else "Activités :"}</strong> {"Measure period T₀ of spring-mass vs mass m; verify T₀² is proportional to m. Measure simple pendulum period vs length L to deduce g." if lang=="en" else "Mesure de T₀ en fonction de m et L ; déduction de g et vérification des périodes propres."}<br>
                                <strong>{"Evaluation:" if lang=="en" else "Évaluation :"}</strong> {"Oscillator differential equations and period calculations." if lang=="en" else "Exercices d'oscillateurs et Devoir surveillé 5."}
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

    # ---------------- PAGE 11: MECHANICS UNITS 7 & 8 (ENERGY & ATOM) ----------------
    p11 = f"""
    <div class="page">
        <div>
            {render_official_header("2BAC Sciences", "Physics Component" if lang=="en" else "Composante Physique", 10, lang)}
            
            <!-- UNIT 7 -->
            <div class="unit-block">
                <div class="unit-banner">
                    <span>{"Unit 7: Energy Aspects of Mechanical Oscillators" if lang=="en" else "Unité 7 : Aspects Énergétiques des Oscillateurs Mécaniques"}</span>
                    <span>4 {"Hours" if lang=="en" else "Heures"}</span>
                </div>
                <div class="unit-prereq-problem">
                    <div class="prereq-col">
                        <div class="block-title">{"Prerequisites:" if lang=="en" else "Prérequis :"}</div>
                        {"Kinetic energy, potential energy, mechanical energy." if lang=="en" else "Énergie cinétique, énergie potentielle, énergie mécanique."}
                    </div>
                    <div class="problem-col">
                        <div class="block-title">{"Problem Situation:" if lang=="en" else "Situation-Problème :"}</div>
                        {"Trapeze acrobats oscillate with continuous energy exchanges. What are the expressions for elastic potential energy and total mechanical energy?" if lang=="en" else "Les acrobates de trapèze échangent continuellement énergie cinétique et potentielle. Comment exprimer l'énergie potentielle élastique ?" }
                    </div>
                </div>
                <table class="pedagogical-table">
                    <thead><tr><th style="width:25%;">{"Objectives" if lang=="en" else "Objectifs"}</th><th style="width:25%;">{"Contents" if lang=="en" else "Contenus"}</th><th style="width:25%;">{"Didactic Materials" if lang=="en" else "Matériel Didactique"}</th><th style="width:25%;">{"Activities & Evaluation" if lang=="en" else "Activités & Évaluation"}</th></tr></thead>
                    <tbody>
                        <tr>
                            <td>
                                <ul>
                                    <li>{"Elastic potential energy of spring: E_pe = 0.5 · k · x² + C (Joules)." if lang=="en" else "Énergie potentielle élastique : E_pe = 0,5 · k · x² + Cte."}</li>
                                    <li>{"Torsion potential energy: E_pt = 0.5 · C · θ² + C (Joules)." if lang=="en" else "Énergie potentielle de torsion : E_pt = 0,5 · C · θ²."}</li>
                                    <li>{"Mechanical energy: E_m = E_c + E_p = 0.5·m·v² + 0.5·k·x² = const." if lang=="en" else "Énergie mécanique : E_m = E_c + E_pe = Cte."}</li>
                                    <li>{"Derive differential equation by time differentiation of E_m: dE_m/dt = 0." if lang=="en" else "Dérivation de l'équation différentielle par dE_m/dt = 0."}</li>
                                    <li>{"Energy diagrams E_c(x), E_p(x), E_m(x) and potential wells." if lang=="en" else "Diagrammes d'énergie E_c(x), E_p(x) et puits de potentiel."}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>I. {"Spring-Mass Energy" if lang=="en" else "Énergie du Pendule Élastique"}</strong> (1. {"Work of spring tension" if lang=="en" else "Travail de tension"}, 2. {"Elastic potential energy E_pe" if lang=="en" else "Énergie potentielle élastique"}, 3. {"Conservation of E_m" if lang=="en" else "Conservation de E_m"})<br>
                                <strong>II. {"Torsion & Pendulum Energy" if lang=="en" else "Pendule de Torsion et Pesant"}</strong> (1. {"Torsion potential energy E_pt" if lang=="en" else "Énergie de torsion"}, 2. {"Gravitational potential energy E_pp" if lang=="en" else "Énergie de pesanteur"})<br>
                                <strong>III. {"Energy Diagrams" if lang=="en" else "Diagrammes d'Énergie"}</strong>
                            </td>
                            <td>
                                <ul>
                                    <li>{"Horizontal spring glider with position and force sensors" if lang=="en" else "Chariot à ressort avec capteurs de position et force"}</li>
                                    <li>{"Computer data acquisition system (Regressi/Datastudio)" if lang=="en" else "Interface d'acquisition PC et logiciel Regressi"}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>{"Activities:" if lang=="en" else "Activités :"}</strong> {"Plot experimental curves E_c(t), E_p(t), and E_m(t); verify total energy conservation; observe damped envelope with friction." if lang=="en" else "Tracé des courbes d'énergie ; vérification de la conservation et de l'amortissement."}<br>
                                <strong>{"Evaluation:" if lang=="en" else "Évaluation :"}</strong> {"Energy diagram reading problems and Supervised Exam 6." if lang=="en" else "Exploitation de diagrammes d'énergie et Devoir 6."}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- UNIT 8 -->
            <div class="unit-block">
                <div class="unit-banner">
                    <span>{"Unit 8: The Atom and Newtonian Mechanics (Mathematical Sciences)" if lang=="en" else "Unité 8 : L'Atome et la Mécanique de Newton (Sciences Mathématiques)"}</span>
                    <span>5 {"Hours" if lang=="en" else "Heures"}</span>
                </div>
                <div class="unit-prereq-problem">
                    <div class="prereq-col">
                        <div class="block-title">{"Prerequisites:" if lang=="en" else "Prérequis :"}</div>
                        {"Planetary motion, Coulomb's law, light wave frequency, photon energy." if lang=="en" else "Mouvement planétaire, loi de Coulomb, photon, spectres."}
                    </div>
                    <div class="problem-col">
                        <div class="block-title">{"Problem Situation:" if lang=="en" else "Situation-Problème :"}</div>
                        {"Classical mechanics predicts orbiting electrons would radiate energy and collapse into the nucleus. How did Bohr's postulates introduce energy quantization?" if lang=="en" else "Selon la physique classique, l'électron devrait s'écraser sur le noyau. Comment les postulats de Bohr introduisent-ils la quantification ?" }
                    </div>
                </div>
                <table class="pedagogical-table">
                    <thead><tr><th style="width:25%;">{"Objectives" if lang=="en" else "Objectifs"}</th><th style="width:25%;">{"Contents" if lang=="en" else "Contenus"}</th><th style="width:25%;">{"Didactic Materials" if lang=="en" else "Matériel Didactique"}</th><th style="width:25%;">{"Activities & Evaluation" if lang=="en" else "Activités & Évaluation"}</th></tr></thead>
                    <tbody>
                        <tr>
                            <td>
                                <ul>
                                    <li>{"Limits of Newtonian mechanics at microscopic atomic scale." if lang=="en" else "Limites de la mécanique newtonienne à l'échelle atomique."}</li>
                                    <li>{"Concept of light photon: E_photon = h · ν = h · c / λ (Planck's constant h)." if lang=="en" else "Photon et quantum d'énergie : E = h·ν = h·c/λ."}</li>
                                    <li>{"Quantization of atomic energy levels: E_n = -E₀ / n² (for hydrogen, E₀ = 13.6 eV)." if lang=="en" else "Niveaux d'énergie quantifiés : E_n = -13,6 / n² (eV)."}</li>
                                    <li>{"Bohr's frequency condition: ΔE = |E_p - E_n| = h · ν." if lang=="en" else "Condition de Bohr : ΔE = |E_p - E_n| = h · ν."}</li>
                                    <li>{"Hydrogen emission and absorption line spectra (Lyman, Balmer, Paschen)." if lang=="en" else "Spectres de raies de l'hydrogène (Lyman, Balmer)."}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>I. {"Limits of Classical Mechanics" if lang=="en" else "Limites de la Physique Classique"}</strong> (1. {"Rutherford planetary atom instability" if lang=="en" else "Instabilité du modèle planétaire"}, 2. {"Continuous vs discrete energy" if lang=="en" else "Continuité vs quantification"})<br>
                                <strong>II. {"Energy Quantization" if lang=="en" else "Quantification de l'Énergie"}</strong> (1. {"The photon" if lang=="en" else "Le photon"}, 2. {"Bohr postulates" if lang=="en" else "Postulats de Bohr"}, 3. {"Energy levels of hydrogen" if lang=="en" else "Niveaux de l'hydrogène"})<br>
                                <strong>III. {"Atomic Line Spectra" if lang=="en" else "Spectres de Raies"}</strong> (1. {"Emission & absorption" if lang=="en" else "Émission et absorption"}, 2. {"Balmer spectral series" if lang=="en" else "Série de Balmer"})
                            </td>
                            <td>
                                <ul>
                                    <li>{"Hydrogen discharge spectral tube, high-voltage power supply" if lang=="en" else "Tube spectral à hydrogène, alimentation haute tension"}</li>
                                    <li>{"Diffraction grating spectrometer (goniometer)" if lang=="en" else "Spectroscope à réseau de diffraction"}</li>
                                    <li>{"Solar Fraunhofer lines poster and energy diagram software" if lang=="en" else "Poster des raies de Fraunhofer et logiciel de simulation"}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>{"Activities:" if lang=="en" else "Activités :"}</strong> {"Observe hydrogen spectral lines through diffraction grating; calculate wavelengths of Balmer lines; match with ΔE transitions." if lang=="en" else "Observation des raies de l'hydrogène au spectroscope et calcul des longueurs d'onde de transition."}<br>
                                <strong>{"Evaluation:" if lang=="en" else "Évaluation :"}</strong> {"Photon wavelength calculations and transition energy problem sets." if lang=="en" else "Calculs de transitions atomiques et Devoir surveillé 6."}
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

    # ---------------- PAGE 12: CHEMISTRY OVERVIEW & UNITS 1 & 2 ----------------
    p12 = f"""
    <div class="page">
        <div>
            {render_official_header("2BAC Sciences", "Chemistry Component" if lang=="en" else "Composante Chimie", 11, lang)}
            <div class="overview-box">
                <div class="overview-title">{"Introduction & Part 1: Fast & Slow Reactions • Reaction Kinetics (Total: 8 - 11 Hours)" if lang=="en" else "Introduction & Partie 1 : Transformations Lentes et Rapides • Cinétique Chimique (8 - 11 Heures)"}</div>
                <div class="overview-grid">
                    <div>
                        <strong>{"Questions Posed to the Chemist (1h):" if lang=="en" else "Questions posées au chimiste (1h) :"}</strong>
                        {"Understand chemical control, synthesis, tracking reaction evolution, and hazardous material safety." if lang=="en" else "Comprendre le contrôle chimique, la synthèse, le suivi des réactions et la sécurité."}
                    </div>
                    <div>
                        <strong>{"Part 1 Units:" if lang=="en" else "Unités de la Partie :"}</strong>
                        1. {"Fast and Slow Transformations (3h)" if lang=="en" else "Transformations lentes et rapides (3h)"} • 
                        2. {"Time Tracking of a Chemical Reaction - Reaction Rate (5-8h)" if lang=="en" else "Suivi temporel d'une réaction - Vitesse de réaction (5-8h)"}
                    </div>
                </div>
            </div>

            <!-- UNIT 1 -->
            <div class="unit-block">
                <div class="unit-banner">
                    <span>{"Unit 1: Fast and Slow Transformations" if lang=="en" else "Unité 1 : Transformations Lentes et Rapides"}</span>
                    <span>3 {"Hours" if lang=="en" else "Heures"}</span>
                </div>
                <div class="unit-prereq-problem">
                    <div class="prereq-col">
                        <div class="block-title">{"Prerequisites:" if lang=="en" else "Prérequis :"}</div>
                        {"Oxidation-reduction, redox couples Ox/Red, electron transfer." if lang=="en" else "Oxydoréduction, couples Ox/Red, transferts d'électrons."}
                    </div>
                    <div class="problem-col">
                        <div class="block-title">{"Problem Situation:" if lang=="en" else "Situation-Problème :"}</div>
                        {"Book pages slowly yellow over decades, while gasoline combustion occurs in milliseconds. What separates slow and fast reactions, and what are kinetic factors?" if lang=="en" else "Le papier jaunit lentement au fil des ans alors que l'essence explose instantanément. Qu'est-ce qui distingue ces réactions ?"}
                    </div>
                </div>
                <table class="pedagogical-table">
                    <thead><tr><th style="width:25%;">{"Objectives" if lang=="en" else "Objectifs"}</th><th style="width:25%;">{"Contents" if lang=="en" else "Contenus"}</th><th style="width:25%;">{"Didactic Materials" if lang=="en" else "Matériel Didactique"}</th><th style="width:25%;">{"Activities & Evaluation" if lang=="en" else "Activités & Évaluation"}</th></tr></thead>
                    <tbody>
                        <tr>
                            <td>
                                <ul>
                                    <li>{"Fast reactions: instantaneous change impossible to track with human eye." if lang=="en" else "Transformations rapides : instantanées."}</li>
                                    <li>{"Slow reactions: progress measurable over seconds, minutes, or hours." if lang=="en" else "Transformations lentes : mesurables dans le temps."}</li>
                                    <li>{"Kinetic factors: temperature (thermal quenching / acceleration)." if lang=="en" else "Facteurs cinétiques : température (trempe / accélération)."}</li>
                                    <li>{"Initial reactant concentrations effect." if lang=="en" else "Influence des concentrations initiales."}</li>
                                    <li>{"Role of catalysts in speeding reactions without consumption." if lang=="en" else "Rôle des catalyseurs."}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>I. {"Redox Recall" if lang=="en" else "Rappels Redox"}</strong> (1. {"Couples Ox/Red" if lang=="en" else "Couples Ox/Red"}, 2. {"Half-equations" if lang=="en" else "Demi-équations"})<br>
                                <strong>II. {"Fast vs Slow Reactions" if lang=="en" else "Transformations Rapides et Lentes"}</strong> (1. {"Fast precipitation" if lang=="en" else "Précipitations rapides"}, 2. {"Slow oxidation of I⁻ by H₂O₂" if lang=="en" else "Oxydation lente de I⁻ par H₂O₂"})<br>
                                <strong>III. {"Kinetic Factors" if lang=="en" else "Facteurs Cinétiques"}</strong> (1. {"Temperature effect" if lang=="en" else "Effet de la température"}, 2. {"Concentration effect" if lang=="en" else "Effet des concentrations"}, 3. {"Catalysts" if lang=="en" else "Catalyseurs"})
                            </td>
                            <td>
                                <ul>
                                    <li>{"Solutions: KI, H₂O₂, Na₂S₂O₃, starch indicator, ice bath" if lang=="en" else "Solutions : KI, H₂O₂, Na₂S₂O₃, empois d'amidon, glace"}</li>
                                    <li>{"Test tubes, beakers, magnetic stirrer, hot water bath" if lang=="en" else "Tubes à essais, béchers, bain-marie thermostaté"}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>{"Activities:" if lang=="en" else "Activités :"}</strong> {"Mix I⁻ and H₂O₂ at 0°C, 20°C, 50°C; observe blue starch appearance time. Demonstrate quenching in ice water." if lang=="en" else "Mélange I⁻ + H₂O₂ à diverses températures ; mise en évidence de la trempe thermique."}<br>
                                <strong>{"Evaluation:" if lang=="en" else "Évaluation :"}</strong> {"Redox equations balancing and kinetic factors tests." if lang=="en" else "Équilibrage de réactions et Devoir surveillé 1."}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- UNIT 2 -->
            <div class="unit-block">
                <div class="unit-banner">
                    <span>{"Unit 2: Time Tracking of a Chemical Reaction - Reaction Rate" if lang=="en" else "Unité 2 : Suivi Temporel d'une Réaction - Vitesse de Réaction"}</span>
                    <span>6 {"Hours" if lang=="en" else "Heures"}</span>
                </div>
                <div class="unit-prereq-problem">
                    <div class="prereq-col">
                        <div class="block-title">{"Prerequisites:" if lang=="en" else "Prérequis :"}</div>
                        {"ICE table, conductometry, ideal gas law, titration." if lang=="en" else "Tableau d'avancement, conductimétrie, gaz parfaits, titrage."}
                    </div>
                    <div class="problem-col">
                        <div class="block-title">{"Problem Situation:" if lang=="en" else "Situation-Problème :"}</div>
                        {"Leaves gradually lose their green color in autumn. How do chemists track the exact progress x(t) over time, and what is the half-life t_(1/2)?" if lang=="en" else "Les feuilles perdent graduellement leur couleur en automne. Comment suivre l'avancement x(t) et déterminer le temps de demi-réaction ?" }
                    </div>
                </div>
                <table class="pedagogical-table">
                    <thead><tr><th style="width:25%;">{"Objectives" if lang=="en" else "Objectifs"}</th><th style="width:25%;">{"Contents" if lang=="en" else "Contenus"}</th><th style="width:25%;">{"Didactic Materials" if lang=="en" else "Matériel Didactique"}</th><th style="width:25%;">{"Activities & Evaluation" if lang=="en" else "Activités & Évaluation"}</th></tr></thead>
                    <tbody>
                        <tr>
                            <td>
                                <ul>
                                    <li>{"Methods of kinetic tracking: chemical titration, conductometry, manometry, spectrophotometry." if lang=="en" else "Méthodes de suivi : titrage, conductimétrie, pressiométrie, spectrophotométrie."}</li>
                                    <li>{"Volumetric reaction rate: v(t) = (1/V) · (dx/dt) (mol·L⁻¹·s⁻¹)." if lang=="en" else "Vitesse volumique : v(t) = (1/V) · (dx/dt)."}</li>
                                    <li>{"Determine reaction rate graphically from slope of tangent to x(t)." if lang=="en" else "Détermination graphique par la pente de la tangente."}</li>
                                    <li>{"Rate decreases over time due to depletion of reactants." if lang=="en" else "Diminution de la vitesse au cours du temps."}</li>
                                    <li>{"Half-life of reaction t_(1/2): x(t_(1/2)) = x_f / 2." if lang=="en" else "Temps de demi-réaction t_(1/2) : x(t_(1/2)) = x_f / 2."}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>I. {"Tracking Methods" if lang=="en" else "Méthodes de Suivi"}</strong> (1. {"Chemical titration with quenching" if lang=="en" else "Dosage avec trempe"}, 2. {"Physical: conductometry & pressure" if lang=="en" else "Méthodes physiques (σ, P)"})<br>
                                <strong>II. {"Volumetric Reaction Rate" if lang=="en" else "Vitesse Volumique"}</strong> (1. {"Definition v = (1/V) dx/dt" if lang=="en" else "Définition v = (1/V) dx/dt"}, 2. {"Tangent method" if lang=="en" else "Méthode des tangentes"}, 3. {"Rate decrease interpretation" if lang=="en" else "Évolution temporelle"})<br>
                                <strong>III. {"Reaction Half-Life" if lang=="en" else "Temps de Demi-Réaction"}</strong> (1. {"Definition x(t_1/2) = x_f/2" if lang=="en" else "Définition x(t_1/2) = x_f/2"}, 2. {"Graphical extraction" if lang=="en" else "Détermination graphique"})
                            </td>
                            <td>
                                <ul>
                                    <li>{"Precision conductometer, sealed flask with manometer" if lang=="en" else "Conductimètre, fiole étanche avec manomètre"}</li>
                                    <li>{"Burettes, pipettes, stopwatch, ice bath" if lang=="en" else "Burettes, pipettes, chronomètre, glace"}</li>
                                    <li>{"Reagents: HCl, Mg ribbon, KI, H₂O₂, Na₂S₂O₃" if lang=="en" else "Solutions : HCl, ruban de Mg, KI, H₂O₂, thiosulfate"}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>{"Activities:" if lang=="en" else "Activités :"}</strong> {"Track Mg + 2HCl by measuring H₂ pressure P(t); express x(t) = ΔP·V / (R·T); plot x(t) and measure tangents to calculate v(0) and v(t). Find t_(1/2)." if lang=="en" else "Suivi pressiométrique de Mg + HCl ; tracé de x(t) ; tracé des tangentes et lecture de t_(1/2)."}<br>
                                <strong>{"Evaluation:" if lang=="en" else "Évaluation :"}</strong> {"Tangent slope calculations and half-life determinations; Exam 1." if lang=="en" else "Calculs de pentes et Devoir surveillé 1."}
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

    # ---------------- PAGE 13: CHEMISTRY PART 2 UNITS 1 & 2 ----------------
    p13 = f"""
    <div class="page">
        <div>
            {render_official_header("2BAC Sciences", "Chemistry Component" if lang=="en" else "Composante Chimie", 12, lang)}
            <div class="overview-box">
                <div class="overview-title">{"Part 2: Non-Total Transformations of a Chemical System (Total: 13 - 17 Hours)" if lang=="en" else "Partie 2 : Transformations Non Totales d'un Système Chimique (13 - 17 Heures)"}</div>
            </div>

            <!-- UNIT 1 -->
            <div class="unit-block">
                <div class="unit-banner">
                    <span>{"Unit 1: Chemical Reactions Occurring in Both Directions" if lang=="en" else "Unité 1 : Transformations Chimiques S'Effectuant dans les Deux Sens"}</span>
                    <span>3 {"Hours" if lang=="en" else "Heures"}</span>
                </div>
                <div class="unit-prereq-problem">
                    <div class="prereq-col">
                        <div class="block-title">{"Prerequisites:" if lang=="en" else "Prérequis :"}</div>
                        {"ICE table, limiting reactant, Brønsted acid-base theory." if lang=="en" else "Tableau d'avancement, réactif limitant, théorie de Brønsted."}
                    </div>
                    <div class="problem-col">
                        <div class="block-title">{"Problem Situation:" if lang=="en" else "Situation-Problème :"}</div>
                        {"Cave formation dissolves limestone, while cave stalactite precipitation reverses it. What characterizes reactions that occur in both directions?" if lang=="en" else "La formation des grottes dissout le calcaire tandis que les concrétions le reforment. Que caractérise une réaction équilibrée réversible ?"}
                    </div>
                </div>
                <table class="pedagogical-table">
                    <thead><tr><th style="width:25%;">{"Objectives" if lang=="en" else "Objectifs"}</th><th style="width:25%;">{"Contents" if lang=="en" else "Contenus"}</th><th style="width:25%;">{"Didactic Materials" if lang=="en" else "Matériel Didactique"}</th><th style="width:25%;">{"Activities & Evaluation" if lang=="en" else "Activités & Évaluation"}</th></tr></thead>
                    <tbody>
                        <tr>
                            <td>
                                <ul>
                                    <li>{"Measure solution pH: pH = -log[H₃O⁺] ⇔ [H₃O⁺] = 10^(-pH)." if lang=="en" else "Mesure du pH : pH = -log[H₃O⁺] ⇔ [H₃O⁺] = 10^(-pH)."}</li>
                                    <li>{"Final progress x_f vs theoretical maximum progress x_max." if lang=="en" else "Avancement final x_f vs avancement maximal x_max."}</li>
                                    <li>{"Final progress ratio: τ = x_f / x_max." if lang=="en" else "Taux d'avancement final : τ = x_f / x_max."}</li>
                                    <li>{"Distinguish total reaction (τ = 1) from limited reaction (τ < 1)." if lang=="en" else "Réaction totale (τ = 1) et limitée (τ < 1)."}</li>
                                    <li>{"State of dynamic chemical equilibrium (two opposing directions at equal rates)." if lang=="en" else "État d'équilibre chimique dynamique."}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>I. {"Acid-Base & pH" if lang=="en" else "Acide-Base et pH"}</strong> (1. {"Bronsted couples" if lang=="en" else "Couples de Brønsted"}, 2. {"Definition & measurement of pH" if lang=="en" else "Définition et mesure du pH"})<br>
                                <strong>II. {"Progress of Reaction" if lang=="en" else "Avancement"}</strong> (1. {"Maximum progress x_max" if lang=="en" else "Avancement maximal x_max"}, 2. {"Final progress x_f" if lang=="en" else "Avancement final x_f"}, 3. {"Final progress ratio τ" if lang=="en" else "Taux d'avancement final τ"})<br>
                                <strong>III. {"State of Chemical Equilibrium" if lang=="en" else "État d'Équilibre"}</strong> (1. {"Equilibrium state" if lang=="en" else "Définition de l'équilibre"}, 2. {"Microscopic interpretation" if lang=="en" else "Interprétation microscopique"})
                            </td>
                            <td>
                                <ul>
                                    <li>{"Calibrated digital pH-meter with buffer solutions (pH 4, 7)" if lang=="en" else "pH-mètre numérique étalonné avec tampons"}</li>
                                    <li>{"Solutions: Ethanoic acid CH₃COOH, hydrochloric acid HCl (same C)" if lang=="en" else "Solutions : Acide éthanoïque et acide chlorhydrique"}</li>
                                    <li>{"Magnetic stirrer, beakers, precision volumetric pipettes" if lang=="en" else "Agitateur magnétique, béchers, pipettes jaugées"}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>{"Activities:" if lang=="en" else "Activités :"}</strong> {"Measure pH of 0.01 M HCl (find pH ≈ 2, τ = 1, total) vs 0.01 M CH₃COOH (find pH ≈ 3.4, τ ≈ 4%, limited equilibrium)." if lang=="en" else "Mesure de pH de HCl (τ = 1) et CH₃COOH (τ ≈ 4%) pour distinguer réaction totale et limitée."}<br>
                                <strong>{"Evaluation:" if lang=="en" else "Évaluation :"}</strong> {"Calculations of x_f, x_max, and τ from pH." if lang=="en" else "Calculs de x_f, x_max et τ à partir du pH."}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- UNIT 2 -->
            <div class="unit-block">
                <div class="unit-banner">
                    <span>{"Unit 2: State of Chemical Equilibrium" if lang=="en" else "Unité 2 : État d'Équilibre d'un Système Chimique"}</span>
                    <span>5 {"Hours" if lang=="en" else "Heures"}</span>
                </div>
                <div class="unit-prereq-problem">
                    <div class="prereq-col">
                        <div class="block-title">{"Prerequisites:" if lang=="en" else "Prérequis :"}</div>
                        {"Final progress ratio τ, conductivity of ionic solutions." if lang=="en" else "Taux d'avancement τ, conductivité des solutions."}
                    </div>
                    <div class="problem-col">
                        <div class="block-title">{"Problem Situation:" if lang=="en" else "Situation-Problème :"}</div>
                        {"Salicylic acid in willow bark is in chemical equilibrium with water. What is the equilibrium constant K and what factors influence final progress?" if lang=="en" else "L'acide salicylique est en équilibre avec l'eau. Qu'est-ce que la constante d'équilibre K et de quoi dépend-elle ?"}
                    </div>
                </div>
                <table class="pedagogical-table">
                    <thead><tr><th style="width:25%;">{"Objectives" if lang=="en" else "Objectifs"}</th><th style="width:25%;">{"Contents" if lang=="en" else "Contenus"}</th><th style="width:25%;">{"Didactic Materials" if lang=="en" else "Matériel Didactique"}</th><th style="width:25%;">{"Activities & Evaluation" if lang=="en" else "Activités & Évaluation"}</th></tr></thead>
                    <tbody>
                        <tr>
                            <td>
                                <ul>
                                    <li>{"Reaction quotient Q_r expression: Q_r = Π [Products]^p / Π [Reactants]^r." if lang=="en" else "Quotient de réaction : Q_r = Π [Produits] / Π [Réactifs]."}</li>
                                    <li>{"Solids and solvent water take activity equal to 1 in Q_r." if lang=="en" else "Les solides et l'eau solvant valent 1 dans Q_r."}</li>
                                    <li>{"Equilibrium constant: K = Q_r,eq depends exclusively on temperature." if lang=="en" else "Constante d'équilibre : K = Q_r,eq (dépend de T)."}</li>
                                    <li>{"Independence of K from initial concentrations." if lang=="en" else "Indépendance de K vis-à-vis des concentrations initiales."}</li>
                                    <li>{"Influence of initial concentration: dilution increases final progress ratio τ." if lang=="en" else "La dilution augmente le taux d'avancement final τ."}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>I. {"Reaction Quotient Q_r" if lang=="en" else "Quotient de Réaction Q_r"}</strong> (1. {"Definition" if lang=="en" else "Définition"}, 2. {"Homogeneous vs heterogeneous systems" if lang=="en" else "Espèces dissoutes et solides"}, 3. {"Q_r,eq at equilibrium" if lang=="en" else "Q_r,eq à l'équilibre"})<br>
                                <strong>II. {"Equilibrium Constant K" if lang=="en" else "Constante d'Équilibre K"}</strong> (1. {"K = Q_r,eq definition" if lang=="en" else "Définition K = Q_r,eq"}, 2. {"Total reaction K > 10⁴" if lang=="en" else "Réaction quasi-totale K > 10⁴"}, 3. {"Reverse reaction constant K' = 1/K" if lang=="en" else "Sens inverse K' = 1/K"})<br>
                                <strong>III. {"Factors Influencing τ" if lang=="en" else "Facteurs Influençant τ"}</strong> (1. {"Initial state effect" if lang=="en" else "Effet de l'état initial"}, 2. {"Equilibrium constant effect" if lang=="en" else "Effet de la valeur de K"})
                            </td>
                            <td>
                                <ul>
                                    <li>{"Precision conductometer with dip cell, digital thermometer" if lang=="en" else "Conductimètre avec cellule étalonnée, thermomètre"}</li>
                                    <li>{"Solutions: Ethanoic acid CH₃COOH at 10⁻¹ M, 10⁻² M, 10⁻³ M" if lang=="en" else "Solutions d'acide éthanoïque à diverses concentrations"}</li>
                                    <li>{"Methanoic acid HCOOH solutions, magnetic stirrer" if lang=="en" else "Solutions d'acide méthanoïque, agitateur"}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>{"Activities:" if lang=="en" else "Activités :"}</strong> {"Measure conductivity σ for 3 concentrations of ethanoic acid; calculate Q_r,eq; verify that K is identical while τ increases with dilution." if lang=="en" else "Mesure de conductivité pour 3 dilutions ; vérification de K constant et augmentation de τ avec la dilution."}<br>
                                <strong>{"Evaluation:" if lang=="en" else "Évaluation :"}</strong> {"Equilibrium constant K calculations and Supervised Exam 2." if lang=="en" else "Calculs de Q_r et K et Devoir surveillé 2."}
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

    # ---------------- PAGE 14: CHEMISTRY PART 2 UNIT 3 (ACID-BASE) ----------------
    p14 = f"""
    <div class="page">
        <div>
            {render_official_header("2BAC Sciences", "Chemistry Component" if lang=="en" else "Composante Chimie", 13, lang)}
            <div class="overview-box">
                <div class="overview-title">{"Part 2: Chemistry • Unit 3: Acid-Base Reactions in Aqueous Solution (8 Hours)" if lang=="en" else "Partie 2 : Chimie • Unité 3 : Réactions Acide-Base en Solution Aqueuse (8 Heures)"}</div>
            </div>

            <!-- UNIT 3 -->
            <div class="unit-block">
                <div class="unit-banner">
                    <span>{"Unit 3: Acid-Base Transformations in Aqueous Solution" if lang=="en" else "Unité 3 : Les Transformations Acide-Base en Solution Aqueuse"}</span>
                    <span>8 {"Hours" if lang=="en" else "Heures"}</span>
                </div>
                <div class="unit-prereq-problem">
                    <div class="prereq-col">
                        <div class="block-title">{"Prerequisites:" if lang=="en" else "Prérequis :"}</div>
                        {"pH, equilibrium constant K, Brønsted acid-base theory." if lang=="en" else "pH, constante d'équilibre K, théorie de Brønsted."}
                    </div>
                    <div class="problem-col">
                        <div class="block-title">{"Problem Situation:" if lang=="en" else "Situation-Problème :"}</div>
                        {"Pharmaceutical research requires precise pH-metric titrations of acidic drugs. What is the acidity constant K_a, and how is the equivalence point located?" if lang=="en" else "Le contrôle des médicaments exige des titrages acido-basiques. Qu'est-ce que la constante d'acidité K_a et comment choisir l'indicateur coloré ?"}
                    </div>
                </div>
                <table class="pedagogical-table">
                    <thead><tr><th style="width:25%;">{"Objectives" if lang=="en" else "Objectifs"}</th><th style="width:25%;">{"Contents" if lang=="en" else "Contenus"}</th><th style="width:25%;">{"Didactic Materials" if lang=="en" else "Matériel Didactique"}</th><th style="width:25%;">{"Activities & Evaluation" if lang=="en" else "Activités & Évaluation"}</th></tr></thead>
                    <tbody>
                        <tr>
                            <td>
                                <ul>
                                    <li>{"Water auto-ionization: 2 H₂O ⇌ H₃O⁺ + HO⁻; ionic product K_e = [H₃O⁺]·[HO⁻] = 10^(-14) at 25°C." if lang=="en" else "Autoprotolyse de l'eau : K_e = [H₃O⁺]·[HO⁻] = 10^(-14) à 25°C."}</li>
                                    <li>{"Acidity constant of couple: K_a = [A⁻]·[H₃O⁺] / [HA] and pK_a = -log(K_a)." if lang=="en" else "Constante d'acidité K_a et pK_a = -log(K_a)."}</li>
                                    <li>{"Fundamental Henderson relation: pH = pK_a + log([A⁻] / [HA])." if lang=="en" else "Relation fondamentale : pH = pK_a + log([A⁻] / [HA])."}</li>
                                    <li>{"Predominance diagrams: [HA] > [A⁻] if pH < pK_a; [A⁻] > [HA] if pH > pK_a." if lang=="en" else "Diagrammes de prédominance et de distribution."}</li>
                                    <li>{"Acid-base titration curve pH = f(V_b): equivalence point E by parallel tangent method." if lang=="en" else "Courbe de titrage pH = f(V_b) et méthode des tangentes."}</li>
                                    <li>{"Select appropriate colored indicator: indicator pK_In zone covers pH_E." if lang=="en" else "Choix de l'indicateur coloré adapté (zone de virage contenant pH_E)."}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>I. {"Ionic Product of Water" if lang=="en" else "Produit Ionique de l'Eau"}</strong> (1. {"Auto-ionization K_e" if lang=="en" else "Autoprotolyse K_e"}, 2. {"Neutral, acidic, basic solutions" if lang=="en" else "Solutions neutre, acide, basique"})<br>
                                <strong>II. {"Acidity Constant K_a & pK_a" if lang=="en" else "Constante d'Acidité K_a"}</strong> (1. {"Definition" if lang=="en" else "Définition"}, 2. {"Relation pH = pK_a + log([A⁻]/[HA])" if lang=="en" else "Formule du pH"}, 3. {"Acid-base reaction constant K = K_a1 / K_a2" if lang=="en" else "Constante de réaction K = K_a1/K_a2"})<br>
                                <strong>III. {"Predominance Diagrams" if lang=="en" else "Diagrammes de Prédominance"}</strong> (1. {"Couples HA/A⁻" if lang=="en" else "Couples HA/A⁻"}, 2. {"Colored indicators" if lang=="en" else "Indicateurs colorés"})<br>
                                <strong>IV. {"pH-Metric Titrations" if lang=="en" else "Dosages pH-métriques"}</strong> (1. {"Titration curves" if lang=="en" else "Courbes de titrage"}, 2. {"Equivalence point E" if lang=="en" else "Point d'équivalence E"}, 3. {"Tangent method & dpH/dV derivative" if lang=="en" else "Méthode des tangentes et dérivée"}, 4. {"Indicator selection" if lang=="en" else "Choix de l'indicateur"})
                            </td>
                            <td>
                                <ul>
                                    <li>{"Digital pH-meter with glass electrode and buffers (4.00, 7.00)" if lang=="en" else "pH-mètre étalonné avec solutions tampons (4,00 et 7,00)"}</li>
                                    <li>{"Precision burette (25 mL), volumetric pipette (10 mL), magnetic stirrer" if lang=="en" else "Burette graduée de précision, pipette jaugée, agitateur"}</li>
                                    <li>{"Solutions: Ethanoic acid, hydrochloric acid, sodium hydroxide NaOH" if lang=="en" else "Solutions : Acide éthanoïque, acide chlorhydrique, soude NaOH"}</li>
                                    <li>{"Indicators: Bromothymol blue, phenolphthalein, methyl orange" if lang=="en" else "Indicateurs : BBT, phénolphtaléine, hélianthine"}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>{"Activities:" if lang=="en" else "Activités :"}</strong> {"Perform pH-metric titration of CH₃COOH with NaOH; record pH after each 0.5 mL; plot pH = f(V_b); locate E by tangent method and compare with derivative dpH/dV peak." if lang=="en" else "Titrage pH-métrique de CH₃COOH par NaOH ; tracé de pH = f(V_b) ; repérage de l'équivalence par tangentes et dérivée."}<br>
                                <strong>{"Evaluation:" if lang=="en" else "Évaluation :"}</strong> {"pH-metric titration curves and indicator justification problems; Exam 2/3." if lang=="en" else "Exploitation de courbes de titrage et Devoir surveillé 3."}
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

    # ---------------- PAGE 15: CHEMISTRY PART 3 UNITS 1 & 2 ----------------
    p15 = f"""
    <div class="page">
        <div>
            {render_official_header("2BAC Sciences", "Chemistry Component" if lang=="en" else "Composante Chimie", 14, lang)}
            <div class="overview-box">
                <div class="overview-title">{"Part 3: Direction of Evolution of a Chemical System (Total: 8 - 18 Hours)" if lang=="en" else "Partie 3 : Sens d'Évolution d'un Système Chimique (8 - 18 Heures)"}</div>
            </div>

            <!-- UNIT 1 -->
            <div class="unit-block">
                <div class="unit-banner">
                    <span>{"Unit 1: Spontaneous Evolution of a Chemical System" if lang=="en" else "Unité 1 : Évolution Spontanée d'un Système Chimique"}</span>
                    <span>3 {"Hours" if lang=="en" else "Heures"}</span>
                </div>
                <div class="unit-prereq-problem">
                    <div class="prereq-col">
                        <div class="block-title">{"Prerequisites:" if lang=="en" else "Prérequis :"}</div>
                        {"Reaction quotient Q_r, equilibrium constant K." if lang=="en" else "Quotient de réaction Q_r, constante d'équilibre K."}
                    </div>
                    <div class="problem-col">
                        <div class="block-title">{"Problem Situation:" if lang=="en" else "Situation-Problème :"}</div>
                        {"Coral skeletons form from calcium and carbonate ions, but can dissolve when ocean concentrations shift. How do chemists predict the direction in which a system evolves?" if lang=="en" else "Le corail se forme ou se dissout selon les concentrations marines. Comment prévoir dans quel sens évolue un système chimique ?"}
                    </div>
                </div>
                <table class="pedagogical-table">
                    <thead><tr><th style="width:25%;">{"Objectives" if lang=="en" else "Objectifs"}</th><th style="width:25%;">{"Contents" if lang=="en" else "Contenus"}</th><th style="width:25%;">{"Didactic Materials" if lang=="en" else "Matériel Didactique"}</th><th style="width:25%;">{"Activities & Evaluation" if lang=="en" else "Activités & Évaluation"}</th></tr></thead>
                    <tbody>
                        <tr>
                            <td>
                                <ul>
                                    <li>{"Calculate initial reaction quotient Q_r,i from initial concentrations." if lang=="en" else "Calcul du quotient initial Q_r,i."}</li>
                                    <li>{"Spontaneous Evolution Criterion: compare Q_r,i with K." if lang=="en" else "Critère d'évolution spontanée : comparaison de Q_r,i et K."}</li>
                                    <li>{"If Q_r,i < K: evolves spontaneously in forward direction (1)." if lang=="en" else "Si Q_r,i < K : évolution dans le sens direct (1)."}</li>
                                    <li>{"If Q_r,i > K: evolves spontaneously in reverse direction (2)." if lang=="en" else "Si Q_r,i > K : évolution dans le sens inverse (2)."}</li>
                                    <li>{"If Q_r,i = K: system is at equilibrium (no macroscopic evolution)." if lang=="en" else "Si Q_r,i = K : le système est à l'équilibre."}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>I. {"Recall of Q_r & K" if lang=="en" else "Rappels sur Q_r et K"}</strong> (1. {"Initial quotient Q_r,i" if lang=="en" else "Quotient initial"}, 2. {"Equilibrium constant K" if lang=="en" else "Constante d'équilibre"})<br>
                                <strong>II. {"Spontaneous Evolution Criterion" if lang=="en" else "Critère d'Évolution"}</strong> (1. {"Forward direction (Q_r,i < K)" if lang=="en" else "Sens direct (Q_r,i < K)"}, 2. {"Reverse direction (Q_r,i > K)" if lang=="en" else "Sens inverse (Q_r,i > K)"})<br>
                                <strong>III. {"Applications" if lang=="en" else "Applications"}</strong> (1. {"Acid-base mixtures" if lang=="en" else "Systèmes acide-base"}, 2. {"Redox mixtures (Fe²⁺/Fe³⁺, I₂/I⁻)" if lang=="en" else "Systèmes redox"})
                            </td>
                            <td>
                                <ul>
                                    <li>{"Solutions: I₂, KI, FeSO₄, Fe₂(SO₄)₃, AgNO₃" if lang=="en" else "Solutions : I₂, KI, FeSO₄, Fe₂(SO₄)₃, AgNO₃"}</li>
                                    <li>{"Beakers, test tubes, copper wire, spectrophotometer" if lang=="en" else "Béchers, tubes à essais, fil de cuivre, spectrophotomètre"}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>{"Activities:" if lang=="en" else "Activités :"}</strong> {"Mix solutions with Q_r,i > K; verify formation of reactants and disappearance of products. Mix with Q_r,i < K to confirm forward shift." if lang=="en" else "Mélanges préparés avec Q_r,i < K et Q_r,i > K ; constatation expérimentale du sens de déplacement."}<br>
                                <strong>{"Evaluation:" if lang=="en" else "Évaluation :"}</strong> {"Direction prediction calculations and Exam 3." if lang=="en" else "Calculs de prévision du sens et Devoir surveillé 3."}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- UNIT 2 -->
            <div class="unit-block">
                <div class="unit-banner">
                    <span>{"Unit 2: Spontaneous Reactions in Voltaic Cells and Energy Recovery" if lang=="en" else "Unité 2 : Les Piles Électrochimiques et Récupération d'Énergie"}</span>
                    <span>5 - 7 {"Hours" if lang=="en" else "Heures"}</span>
                </div>
                <div class="unit-prereq-problem">
                    <div class="prereq-col">
                        <div class="block-title">{"Prerequisites:" if lang=="en" else "Prérequis :"}</div>
                        {"Redox reactions, electric current, Faraday's constant." if lang=="en" else "Réactions redox, courant électrique, constante de Faraday."}
                    </div>
                    <div class="problem-col">
                        <div class="block-title">{"Problem Situation:" if lang=="en" else "Situation-Problème :"}</div>
                        {"Batteries power cars and portable electronics. How do spontaneous chemical reactions in electrochemical cells generate electric power?" if lang=="en" else "Les piles alimentent nos appareils nomades. Quel est le principe de conversion de l'énergie chimique en électricité ?"}
                    </div>
                </div>
                <table class="pedagogical-table">
                    <thead><tr><th style="width:25%;">{"Objectives" if lang=="en" else "Objectifs"}</th><th style="width:25%;">{"Contents" if lang=="en" else "Contenus"}</th><th style="width:25%;">{"Didactic Materials" if lang=="en" else "Matériel Didactique"}</th><th style="width:25%;">{"Activities & Evaluation" if lang=="en" else "Activités & Évaluation"}</th></tr></thead>
                    <tbody>
                        <tr>
                            <td>
                                <ul>
                                    <li>{"Direct electron transfer (in same beaker) vs indirect transfer (via wire)." if lang=="en" else "Transfert d'électrons direct vs indirect par fil."}</li>
                                    <li>{"Constitution of galvanic cell: 2 half-cells, electrodes, and salt bridge." if lang=="en" else "Constitution d'une pile : demi-piles et pont salin."}</li>
                                    <li>{"Anode (-): Oxidation (loss of electrons). Cathode (+): Reduction." if lang=="en" else "Anode (-) : Oxydation. Cathode (+) : Réduction."}</li>
                                    <li>{"Cell electrical capacity: Q_max = I · Δt = n(e⁻) · F." if lang=="en" else "Capacité électrique : Q_max = I · Δt = n(e⁻) · F."}</li>
                                    <li>{"Faraday constant: F = N_A · e ≈ 96500 C/mol." if lang=="en" else "Constante de Faraday : F = N_A · e ≈ 96 500 C/mol."}</li>
                                    <li>{"Relate mass changes Δm of electrodes to current I and duration Δt." if lang=="en" else "Variation de masse des électrodes en fonction de I et Δt."}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>I. {"Electron Transfer" if lang=="en" else "Transfert d'Électrons"}</strong> (1. {"Direct transfer" if lang=="en" else "Transfert direct"}, 2. {"Indirect transfer through circuit" if lang=="en" else "Transfert indirect"})<br>
                                <strong>II. {"Galvanic Cell (Daniell Cell)" if lang=="en" else "La Pile Électrochimique"}</strong> (1. {"Structure & salt bridge role" if lang=="en" else "Description et rôle du pont salin"}, 2. {"Anode & Cathode half-reactions" if lang=="en" else "Demi-équations aux électrodes"}, 3. {"Standard cell diagram" if lang=="en" else "Schéma conventionnel"})<br>
                                <strong>III. {"Electrical Capacity & Matter Balance" if lang=="en" else "Capacité et Bilan de Matière"}</strong> (1. {"Q = I·Δt = n(e⁻)·F" if lang=="en" else "Formule Q = I·Δt = n(e⁻)·F"}, 2. {"Electrode mass variation" if lang=="en" else "Variation de masse des électrodes"})
                            </td>
                            <td>
                                <ul>
                                    <li>{"Copper plate, zinc plate, salt bridge (agar-agar + KNO₃)" if lang=="en" else "Lames de cuivre et zinc, pont salin (KNO₃ gélifié)"}</li>
                                    <li>{"Solutions: CuSO₄ (1 mol/L) and ZnSO₄ (1 mol/L)" if lang=="en" else "Solutions de CuSO₄ et ZnSO₄ à 1 mol/L"}</li>
                                    <li>{"Milliammeter, digital voltmeter, resistor (100 Ω), leads" if lang=="en" else "Milliampermètre, voltmètre, conducteur ohmique"}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>{"Activities:" if lang=="en" else "Activités :"}</strong> {"Build Daniell cell; measure open-circuit EMF (E ≈ 1.1 V); observe electron flow from Zn to Cu; calculate mass of consumed Zn." if lang=="en" else "Réalisation de la pile Daniell ; mesure de la f.é.m. ; constatation du sens du courant et calcul de la masse de zinc consommée."}<br>
                                <strong>{"Evaluation:" if lang=="en" else "Évaluation :"}</strong> {"Cell equations, electrode polarity, and battery capacity calculations." if lang=="en" else "Calculs de capacité de pile et Devoir surveillé 3."}
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

    # ---------------- PAGE 16: CHEMISTRY PART 3 UNIT 3 (ELECTROLYSIS) ----------------
    p16 = f"""
    <div class="page">
        <div>
            {render_official_header("2BAC Sciences", "Chemistry Component" if lang=="en" else "Composante Chimie", 15, lang)}
            <div class="overview-box">
                <div class="overview-title">{"Part 3: Chemistry • Unit 3: Forced Transformations - Electrolysis (8 Hours)" if lang=="en" else "Partie 3 : Chimie • Unité 3 : Transformations Forcées - L'Électrolyse (8 Heures)"}</div>
            </div>

            <!-- UNIT 3 -->
            <div class="unit-block">
                <div class="unit-banner">
                    <span>{"Unit 3: Forced Transformations - Electrolysis" if lang=="en" else "Unité 3 : Exemples de Transformations Forcées - L'Électrolyse"}</span>
                    <span>8 {"Hours" if lang=="en" else "Heures"}</span>
                </div>
                <div class="unit-prereq-problem">
                    <div class="prereq-col">
                        <div class="block-title">{"Prerequisites:" if lang=="en" else "Prérequis :"}</div>
                        {"Redox reactions, electric current, electrochemical cells." if lang=="en" else "Oxydoréduction, courant électrique, piles."}
                    </div>
                    <div class="problem-col">
                        <div class="block-title">{"Problem Situation:" if lang=="en" else "Situation-Problème :"}</div>
                        {"Pure copper is extracted and recycled from ores by electrolysis. How does an external generator force a non-spontaneous chemical reaction to occur?" if lang=="en" else "Le cuivre pur est raffiné par électrolyse. Comment un générateur force-t-il une réaction chimique dans le sens inverse de son sens spontané ?"}
                    </div>
                </div>
                <table class="pedagogical-table">
                    <thead><tr><th style="width:25%;">{"Objectives" if lang=="en" else "Objectifs"}</th><th style="width:25%;">{"Contents" if lang=="en" else "Contenus"}</th><th style="width:25%;">{"Didactic Materials" if lang=="en" else "Matériel Didactique"}</th><th style="width:25%;">{"Activities & Evaluation" if lang=="en" else "Activités & Évaluation"}</th></tr></thead>
                    <tbody>
                        <tr>
                            <td>
                                <ul>
                                    <li>{"Definition of electrolysis: forced endergonic chemical transformation." if lang=="en" else "Définition de l'électrolyse : transformation forcée."}</li>
                                    <li>{"External DC generator imposes electron flow opposite to spontaneous direction." if lang=="en" else "Le générateur impose le sens inverse du sens spontané."}</li>
                                    <li>{"Anode (+): Oxidation (connected to positive terminal)." if lang=="en" else "Anode (+) : Oxydation (reliée au pôle positif)."}</li>
                                    <li>{"Cathode (-): Reduction (connected to negative terminal)." if lang=="en" else "Cathode (-) : Réduction (reliée au pôle négatif)."}</li>
                                    <li>{"Quantitative law: m = (I · Δt · M) / (n · F)." if lang=="en" else "Bilan quantitatif : m = (I · Δt · M) / (n · F)."}</li>
                                    <li>{"Industrial applications: electroplating, copper refining, chlorine production." if lang=="en" else "Applications industrielles : galvanoplastie, affinage."}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>I. {"Principle of Electrolysis" if lang=="en" else "Principe de l'Électrolyse"}</strong> (1. {"Spontaneous vs forced transformations" if lang=="en" else "Transformations spontanées et forcées"}, 2. {"Electrolyzer circuit & DC generator" if lang=="en" else "Montage de l'électrolyseur"}, 3. {"Electrode reactions" if lang=="en" else "Réactions aux électrodes"})<br>
                                <strong>II. {"Quantitative Study" if lang=="en" else "Étude Quantitative"}</strong> (1. {"Charge Q = I·Δt = n(e⁻)·F" if lang=="en" else "Charge électrique Q"}, 2. {"Mass of deposited metal" if lang=="en" else "Masse déposée"}, 3. {"Volume of evolved gas" if lang=="en" else "Volume de gaz dégagé"})<br>
                                <strong>III. {"Industrial Applications" if lang=="en" else "Applications Industrielles"}</strong> (1. {"Lead accumulator recharging" if lang=="en" else "Recharge du accumulateur au plomb"}, 2. {"Electroplating" if lang=="en" else "Dépôt métallique protecteur"})
                            </td>
                            <td>
                                <ul>
                                    <li>{"U-shaped electrolysis tube, graphite electrodes, copper electrodes" if lang=="en" else "Tube en U d'électrolyse, électrodes de graphite et cuivre"}</li>
                                    <li>{"Copper(II) chloride solution CuCl₂, sodium chloride solution" if lang=="en" else "Solution de chlorure de cuivre(II) CuCl₂"}</li>
                                    <li>{"Adjustable DC power supply (0-12V, 2A), ammeter, stopwatch" if lang=="en" else "Alimentation continue réglable (0-12V), ampèremètre"}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>{"Activities:" if lang=="en" else "Activités :"}</strong> {"Electrolyze CuCl₂ solution; observe chlorine gas bubbling at anode and copper metal deposition at cathode. Weigh cathode before and after to verify Faraday's mass law." if lang=="en" else "Électrolyse de CuCl₂ ; observation du dégagement de dichlore et dépôt de cuivre ; vérification de la loi de Faraday."}<br>
                                <strong>{"Evaluation:" if lang=="en" else "Évaluation :"}</strong> {"Faraday electrolysis calculations and Supervised Exam 3." if lang=="en" else "Calculs de masse et volume en électrolyse et Devoir 3."}
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

    # ---------------- PAGE 17: CHEMISTRY PART 4 UNITS 1 & 2 (ORGANIC) ----------------
    p17 = f"""
    <div class="page">
        <div>
            {render_official_header("2BAC Sciences", "Chemistry Component" if lang=="en" else "Composante Chimie", 16, lang)}
            <div class="overview-box">
                <div class="overview-title">{"Part 4: Controlling the Evolution of Chemical Systems (Total: 9 - 12 Hours)" if lang=="en" else "Partie 4 : Contrôle de l'Évolution des Systèmes Chimiques (9 - 12 Heures)"}</div>
            </div>

            <!-- UNIT 1 -->
            <div class="unit-block">
                <div class="unit-banner">
                    <span>{"Unit 1: Esterification and Hydrolysis Reactions" if lang=="en" else "Unité 1 : Les Réactions d'Estérification et d'Hydrolyse"}</span>
                    <span>5 {"Hours" if lang=="en" else "Heures"}</span>
                </div>
                <div class="unit-prereq-problem">
                    <div class="prereq-col">
                        <div class="block-title">{"Prerequisites:" if lang=="en" else "Prérequis :"}</div>
                        {"Alcohols, carboxylic acids, functional groups, equilibrium." if lang=="en" else "Alcools, acides carboxyliques, équilibre chimique."}
                    </div>
                    <div class="problem-col">
                        <div class="block-title">{"Problem Situation:" if lang=="en" else "Situation-Problème :"}</div>
                        {"Beehive wax and honey aromas are formed from esters. How do carboxylic acids and alcohols react to produce esters, and how can the limited yield be improved?" if lang=="en" else "La cire d'abeille et les parfums contiennent des esters. Comment synthétiser un ester et comment augmenter le rendement limité ?"}
                    </div>
                </div>
                <table class="pedagogical-table">
                    <thead><tr><th style="width:25%;">{"Objectives" if lang=="en" else "Objectifs"}</th><th style="width:25%;">{"Contents" if lang=="en" else "Contenus"}</th><th style="width:25%;">{"Didactic Materials" if lang=="en" else "Matériel Didactique"}</th><th style="width:25%;">{"Activities & Evaluation" if lang=="en" else "Activités & Évaluation"}</th></tr></thead>
                    <tbody>
                        <tr>
                            <td>
                                <ul>
                                    <li>{"Identify ester group -COO- and systematic IUPAC nomenclature." if lang=="en" else "Groupe ester -COO- et nomenclature officielle."}</li>
                                    <li>{"Esterification equation: R-COOH + R'-OH ⇌ R-COO-R' + H₂O." if lang=="en" else "Équation : R-COOH + R'-OH ⇌ R-COO-R' + H₂O."}</li>
                                    <li>{"Characteristics: slow, reversible, athermic, limited yield." if lang=="en" else "Caractéristiques : lente, réversible, athermique, limitée."}</li>
                                    <li>{"Hydrolysis of ester: reverse limited reaction." if lang=="en" else "Hydrolyse d'un ester (réaction inverse)."}</li>
                                    <li>{"Reaction yield: r = n_exp(ester) / n_max = x_f / x_max." if lang=="en" else "Rendement : r = n_exp / n_th = x_f / x_max."}</li>
                                    <li>{"Improve yield: excess reactant, Dean-Stark water removal, or using acid anhydride." if lang=="en" else "Amélioration du rendement : excès de réactif ou élimination d'un produit."}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>I. {"Oxygenated Organic Families" if lang=="en" else "Familles Oxygénées"}</strong> (1. {"Alcohols" if lang=="en" else "Alcools"}, 2. {"Carboxylic acids" if lang=="en" else "Acides carboxyliques"}, 3. {"Acid anhydrides" if lang=="en" else "Anhydrides d'acide"}, 4. {"Esters & nomenclature" if lang=="en" else "Esters et nomenclature"})<br>
                                <strong>II. {"Esterification & Hydrolysis" if lang=="en" else "Estérification & Hydrolyse"}</strong> (1. {"Experimental study" if lang=="en" else "Étude expérimentale"}, 2. {"Kinetics & equilibrium constant K ≈ 4 (for 1° alcohol)" if lang=="en" else "Cinétique et constante K ≈ 4"}, 3. {"Yield r" if lang=="en" else "Rendement r"})<br>
                                <strong>III. {"Controlling Reaction" if lang=="en" else "Contrôle du Système"}</strong> (1. {"Catalyst H₂SO₄ & temperature effect" if lang=="en" else "Catalyseur et température"}, 2. {"Shifting equilibrium" if lang=="en" else "Déplacement de l'équilibre"})
                            </td>
                            <td>
                                <ul>
                                    <li>{"Reflux heating setups with Liebig condensers, heating mantles" if lang=="en" else "Montages à reflux avec chauffe-ballons et réfrigérants"}</li>
                                    <li>{"Ethanol, ethanoic acid, sulfuric acid H₂SO₄, ice bath" if lang=="en" else "Éthanol, acide éthanoïque, acide sulfurique"}</li>
                                    <li>{"Burettes, NaOH titrant solution, phenolphthalein" if lang=="en" else "Burettes, soude pour titrage, phénolphtaléine"}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>{"Activities:" if lang=="en" else "Activités :"}</strong> {"Synthesize ethyl ethanoate under reflux; titrate remaining acid over time; plot esterification progress curve; calculate yield r (≈ 67% for equimolar primary alcohol)." if lang=="en" else "Synthèse de l'acétate d'éthyle à reflux ; dosage de l'acide restant au cours du temps ; calcul du rendement r (67%)."}<br>
                                <strong>{"Evaluation:" if lang=="en" else "Évaluation :"}</strong> {"Ester nomenclature, yield optimization calculations, Exam 4." if lang=="en" else "Exercices de rendement et Devoir surveillé 4."}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- UNIT 2 -->
            <div class="unit-block">
                <div class="unit-banner">
                    <span>{"Unit 2: Controlling Chemical Reactions - Saponification" if lang=="en" else "Unité 2 : Contrôle des Transformations Chimiques - La Saponification"}</span>
                    <span>4 {"Hours" if lang=="en" else "Heures"}</span>
                </div>
                <div class="unit-prereq-problem">
                    <div class="prereq-col">
                        <div class="block-title">{"Prerequisites:" if lang=="en" else "Prérequis :"}</div>
                        {"Esters, acid anhydrides, basic solutions, reaction yield." if lang=="en" else "Esters, anhydrides d'acide, solutions basiques, rendement."}
                    </div>
                    <div class="problem-col">
                        <div class="block-title">{"Problem Situation:" if lang=="en" else "Situation-Problème :"}</div>
                        {"Soap is manufactured by alkaline hydrolysis of fatty triglycerides. How is soap prepared with 100% yield, and what makes soap clean grease?" if lang=="en" else "Le savon est fabriqué par saponification des corps gras. Comment synthétiser le savon avec un rendement de 100% et comment nettoie-t-il les graisses ?"}
                    </div>
                </div>
                <table class="pedagogical-table">
                    <thead><tr><th style="width:25%;">{"Objectives" if lang=="en" else "Objectifs"}</th><th style="width:25%;">{"Contents" if lang=="en" else "Contenus"}</th><th style="width:25%;">{"Didactic Materials" if lang=="en" else "Matériel Didactique"}</th><th style="width:25%;">{"Activities & Evaluation" if lang=="en" else "Activités & Évaluation"}</th></tr></thead>
                    <tbody>
                        <tr>
                            <td>
                                <ul>
                                    <li>{"Fast and total ester synthesis using acid anhydride: (R-CO)₂O + R'-OH → R-COOR' + R-COOH." if lang=="en" else "Synthèse totale d'ester par anhydride d'acide (rapide et totale)."}</li>
                                    <li>{"Basic hydrolysis of esters (saponification): R-COOR' + HO⁻ → R-COO⁻ + R'-OH (total reaction)." if lang=="en" else "Hydrolyse basique (saponification) : réaction totale."}</li>
                                    <li>{"Soap synthesis from fatty triglycerides (vegetable oils/fats) + 3 NaOH → glycerol + 3 soap molecules." if lang=="en" else "Saponification des triglycérides (huile + 3 NaOH → glycérol + 3 savons)."}</li>
                                    <li>{"Salting-out process in saturated NaCl brine." if lang=="en" else "Relargage du savon dans la saumure saturée."}</li>
                                    <li>{"Amphiphilic nature of soap carboxylate ions: hydrophobic hydrocarbon tail and hydrophilic polar head." if lang=="en" else "Structure amphiphile du savon (queue lipophile et tête hydrophile)."}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>I. {"Synthesis Using Anhydrides" if lang=="en" else "Synthèse par Anhydride"}</strong> (1. {"Acid anhydride reactivity" if lang=="en" else "Réactivité des anhydrides"}, 2. {"Total synthesis" if lang=="en" else "Caractère total et rapide"})<br>
                                <strong>II. {"Basic Hydrolysis (Saponification)" if lang=="en" else "La Saponification"}</strong> (1. {"Saponification equation" if lang=="en" else "Équation de saponification"}, 2. {"Triglycerides & fats" if lang=="en" else "Corps gras et triglycérides"}, 3. {"Total & fast characteristics" if lang=="en" else "Propriétés totales"})<br>
                                <strong>III. {"Soap Properties" if lang=="en" else "Propriétés du Savon"}</strong> (1. {"Salting-out in brine" if lang=="en" else "Relargage dans l'eau salée"}, 2. {"Hydrophilic / hydrophobic structure" if lang=="en" else "Structure tensioactive"}, 3. {"Micelle mechanism" if lang=="en" else "Mécanisme de nettoyage"})
                            </td>
                            <td>
                                <ul>
                                    <li>{"Olive oil, commercial ethanol, 10 M sodium hydroxide NaOH" if lang=="en" else "Huile d'olive, éthanol, soude concentrée NaOH (10 M)"}</li>
                                    <li>{"Saturated salt brine (NaCl solution), Büchner filter apparatus" if lang=="en" else "Saumure saturée de NaCl, filtre Büchner et fiole à vide"}</li>
                                    <li>{"Heating mantle, round-bottom flask, boiling stones, watch glasses" if lang=="en" else "Chauffe-ballon, ballon, pierre ponce, verres de montre"}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>{"Activities:" if lang=="en" else "Activités :"}</strong> {"Heat olive oil with NaOH in ethanol under reflux for 30 min. Pour into cold saturated brine to precipitate soap (salting out). Filter on Büchner funnel and test lathering with water." if lang=="en" else "Synthèse du savon à reflux ; relargage dans la saumure glacée ; filtration sur Büchner et test du pouvoir moussant."}<br>
                                <strong>{"Evaluation:" if lang=="en" else "Évaluation :"}</strong> {"Saponification mass yield calculations and end-of-year Baccalaureate Exam." if lang=="en" else "Calculs de rendement de saponification et Examen National du Baccalauréat."}
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

    return f"""<!DOCTYPE html>
<html lang="{lang}">
<head>
<meta charset="UTF-8">
<title>Moroccan 2nd Year Baccalaureate Science Curriculum Lesson Plans - Professor AYOUB KHAMMOUR</title>
<style>{CSS_PAGE_STYLE}</style>
</head>
<body>
{"".join(pages_html)}
</body>
</html>"""

def main():
    out_dir = "/home/ubuntu/projects/codshop/pdf_translations"
    os.makedirs(out_dir, exist_ok=True)

    en_html = os.path.join(out_dir, "2BAC_Physics_Chemistry_Lesson_Plans_English.html")
    en_pdf = os.path.join(out_dir, "2BAC_Physics_Chemistry_Lesson_Plans_English.pdf")
    fr_html = os.path.join(out_dir, "2BAC_Physique_Chimie_Fiches_Pedagogiques_Francais.html")
    fr_pdf = os.path.join(out_dir, "2BAC_Physique_Chimie_Fiches_Pedagogiques_Francais.pdf")

    print("Writing 2BAC English HTML (17 pages)...")
    with open(en_html, "w", encoding="utf-8") as f:
        f.write(build_2bac_html("en"))

    print("Writing 2BAC French HTML (17 pages)...")
    with open(fr_html, "w", encoding="utf-8") as f:
        f.write(build_2bac_html("fr"))

    print("Compiling 2BAC English PDF with Chromium...")
    subprocess.run(["/snap/bin/chromium", "--headless=new", "--disable-gpu", "--no-sandbox", f"--print-to-pdf={en_pdf}", f"file://{en_html}"], check=True)

    print("Compiling 2BAC French PDF with Chromium...")
    subprocess.run(["/snap/bin/chromium", "--headless=new", "--disable-gpu", "--no-sandbox", f"--print-to-pdf={fr_pdf}", f"file://{fr_html}"], check=True)

    print(f"2BAC English PDF: {os.path.getsize(en_pdf)} bytes")
    print(f"2BAC French PDF: {os.path.getsize(fr_pdf)} bytes")

if __name__ == "__main__":
    main()
