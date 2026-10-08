# -*- coding: utf-8 -*-
"""
Full 1-to-1 Page-by-Page Generator for Common Core Science & Technology (TC - 13 Pages)
Author: Professor AYOUB KHAMMOUR (SOM: 1503811)
"""

import os
import subprocess

from exhaustive_curriculum_builder import CSS_PAGE_STYLE, render_official_header, render_official_footer

def build_tc_html(lang="en"):
    pages_html = []

    # ---------------- PAGE 1: COVER ----------------
    level_title = "Common Core of Science & Technology" if lang == "en" else "Tronc Commun Scientifique et Technologique"
    author_role = "Prepared by: Professor AYOUB KHAMMOUR" if lang == "en" else "Conception et Réalisation : Professeur AYOUB KHAMMOUR"
    doc_title = "Pedagogical Lesson Plans" if lang == "en" else "Fiches Pédagogiques"
    sub_title = "Physics & Chemistry" if lang == "en" else "Physique et Chimie"
    meta_ref = "Approved Textbooks – Pedagogical Orientations – Ministerial Notes 09-142 & 144" if lang == "en" else "Cadre de Référence Officiel : Manuels Agréés – Orientations Pédagogiques – Notes Ministérielles N° 09-142 et 144"
    
    p1 = f"""
    <div class="cover-page">
        <div class="cover-badge">Royaume du Maroc • Enseignement Secondaire Qualifiant</div>
        <div class="cover-title">{doc_title}</div>
        <div class="cover-subtitle">{sub_title} ({level_title})</div>
        <div class="cover-author">
            <strong>{author_role}</strong><br>
            <span style="font-size: 10pt; color: #64748b;">Registration No / N° SOM : 1503811</span>
        </div>
        <div class="cover-meta">{meta_ref}</div>
    </div>
    """
    pages_html.append(p1)

    # ---------------- PAGE 2: MECHANICS UNITS 1 & 2 ----------------
    p2 = f"""
    <div class="page">
        <div>
            {render_official_header("Common Core" if lang=="en" else "Tronc Commun", "Physics Component" if lang=="en" else "Composante Physique", 1, lang)}
            <div class="overview-box">
                <div class="overview-title">{"Part 1: Mechanics (Total: 28 Hours) • Module 1: Fundamental Interactions (6 Hours)" if lang=="en" else "Partie 1 : Mécanique (28 Heures) • Axe 1 : Les Interactions (6 Heures)"}</div>
                <div class="overview-grid">
                    <div>
                        <strong>{"Targeted Specific Competencies:" if lang=="en" else "Compétences Spécifiques Visées :"}</strong>
                        {"Exploit mechanical models for equilibrium of static/moving bodies. Raise awareness of road safety and speed hazards. Utilize the scientific method and simulation software. Connect everyday phenomena to physics theories." if lang=="en" else "Exploiter les données de la mécanique pour modéliser l'équilibre des corps. Sensibiliser aux dangers de la vitesse et accidents de la route. Développer la démarche scientifique et l'usage des TICE. Relier les théories aux applications quotidiennes."}
                    </div>
                    <div>
                        <strong>{"Part Units Breakdown:" if lang=="en" else "Unités de la Partie :"}</strong>
                        1. {"Universal Gravitation (4h)" if lang=="en" else "La gravitation universelle (4h)"} • 
                        2. {"Mechanical Actions (2h)" if lang=="en" else "Exemples d'actions mécaniques (2h)"} • 
                        3. {"Motion (6h)" if lang=="en" else "Le mouvement (6h)"} • 
                        4. {"Inertia Principle (4h)" if lang=="en" else "Principe d'inertie (4h)"} • 
                        5. {"2-Force Equilibrium (3h)" if lang=="en" else "Équilibre sous 2 forces (3h)"} • 
                        6. {"3-Force Equilibrium (4h)" if lang=="en" else "Équilibre sous 3 forces (4h)"} • 
                        7. {"Rotation Equilibrium (5h)" if lang=="en" else "Équilibre en rotation (5h)"}
                    </div>
                </div>
            </div>

            <!-- UNIT 1 -->
            <div class="unit-block">
                <div class="unit-banner">
                    <span>{"Unit 1: Universal Gravitation" if lang=="en" else "Unité 1 : La Gravitation Universelle"}</span>
                    <span>4 {"Hours" if lang=="en" else "Heures"}</span>
                </div>
                <div class="unit-prereq-problem">
                    <div class="prereq-col">
                        <div class="block-title">{"Prerequisites:" if lang=="en" else "Prérequis :"}</div>
                        {"Mechanical actions; contact vs distance actions; weight and mass; action-reaction principle." if lang=="en" else "Actions mécaniques et leurs effets ; actions de contact et à distance ; masse et poids ; principe d'action-réaction."}
                    </div>
                    <div class="problem-col">
                        <div class="block-title">{"Problem Situation:" if lang=="en" else "Situation-Problème :"}</div>
                        {"The solar system maintains planets in orbit. What ensures this cosmic cohesion? What distinguishes weight from universal gravitational attraction?" if lang=="en" else "Le système solaire maintient la cohésion des planètes sur leurs orbites. À quoi est due cette stabilité ? Que distingue le poids de l'attraction universelle ?"}
                    </div>
                </div>
                <table class="pedagogical-table">
                    <thead><tr><th style="width:25%;">{"Objectives" if lang=="en" else "Objectifs"}</th><th style="width:25%;">{"Contents" if lang=="en" else "Contenus"}</th><th style="width:25%;">{"Didactic Materials" if lang=="en" else "Matériel Didactique"}</th><th style="width:25%;">{"Activities & Evaluation" if lang=="en" else "Activités & Évaluation"}</th></tr></thead>
                    <tbody>
                        <tr>
                            <td>
                                <ul>
                                    <li>{"Scale of distances & orders of magnitude." if lang=="en" else "Échelle des longueurs et ordre de grandeur."}</li>
                                    <li>{"Universal gravitation law: F = G(mA·mB)/d²." if lang=="en" else "Loi de gravitation universelle de Newton."}</li>
                                    <li>{"Terrestrial gravity g and weight P = m·g." if lang=="en" else "Champ de pesanteur g et poids P = m·g."}</li>
                                    <li>{"Variation of g with altitude." if lang=="en" else "Variation de la pesanteur en altitude."}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>I. {"Distance Scale" if lang=="en" else "Échelle des Longueurs"}</strong> (1. {"Powers of 10" if lang=="en" else "Puissances de 10"}, 2. {"Scale axis" if lang=="en" else "Axe gradué"})<br>
                                <strong>II. {"Gravitation" if lang=="en" else "Gravitation"}</strong> (1. {"Newton's law" if lang=="en" else "Loi de Newton"}, 2. {"Application" if lang=="en" else "Application"})<br>
                                <strong>III. {"Gravity & Weight" if lang=="en" else "Pesanteur et Poids"}</strong> (1. {"Body weight" if lang=="en" else "Poids d'un corps"}, 2. {"Variations of g" if lang=="en" else "Variations de g"})
                            </td>
                            <td>
                                <ul>
                                    <li>{"Textbook, board, computer media" if lang=="en" else "Manuel, tableau, animations TICE"}</li>
                                    <li>{"Astronomical videos & solar system charts" if lang=="en" else "Vidéos et posters astronomiques"}</li>
                                    <li>{"Spring dynamometers, slotted masses" if lang=="en" else "Dynamomètres, masses marquées"}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>{"Activities:" if lang=="en" else "Activités :"}</strong> {"Teacher guides planetary force calculations. Students calculate gravitational attraction and deduce order of magnitude." if lang=="en" else "L'enseignant guide les calculs. L'apprenant calcule l'attraction gravitationnelle et détermine les ordres de grandeur."}<br>
                                <strong>{"Evaluation:" if lang=="en" else "Évaluation :"}</strong> {"Diagnostic Qs, formative exercises, Supervised Exam 1." if lang=="en" else "Questions orales, exercices d'application, Devoir surveillé 1."}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- UNIT 2 -->
            <div class="unit-block">
                <div class="unit-banner">
                    <span>{"Unit 2: Examples of Mechanical Actions" if lang=="en" else "Unité 2 : Exemples d'Actions Mécaniques"}</span>
                    <span>2 {"Hours" if lang=="en" else "Heures"}</span>
                </div>
                <div class="unit-prereq-problem">
                    <div class="prereq-col">
                        <div class="block-title">{"Prerequisites:" if lang=="en" else "Prérequis :"}</div>
                        {"Mechanical actions, force vector characteristics, measurement and representation." if lang=="en" else "Actions mécaniques, caractéristiques vectorielles d'une force, mesure et représentation."}
                    </div>
                    <div class="problem-col">
                        <div class="block-title">{"Problem Situation:" if lang=="en" else "Situation-Problème :"}</div>
                        {"Water exerts immense forces on dam walls. What are the classifications of these forces and how is pressure defined?" if lang=="en" else "L'eau d'un barrage exerce une poussée immense sur la digue. Comment classifier ces forces et comment définit-on la pression ?"}
                    </div>
                </div>
                <table class="pedagogical-table">
                    <thead><tr><th style="width:25%;">{"Objectives" if lang=="en" else "Objectifs"}</th><th style="width:25%;">{"Contents" if lang=="en" else "Contenus"}</th><th style="width:25%;">{"Didactic Materials" if lang=="en" else "Matériel Didactique"}</th><th style="width:25%;">{"Activities & Evaluation" if lang=="en" else "Activités & Évaluation"}</th></tr></thead>
                    <tbody>
                        <tr>
                            <td>
                                <ul>
                                    <li>{"Inventory of forces (contact vs remote)." if lang=="en" else "Bilan des forces (contact / à distance)."}</li>
                                    <li>{"Localized vs distributed contact forces." if lang=="en" else "Forces localisées et réparties."}</li>
                                    <li>{"Pressing force & pressure formula P = F / S." if lang=="en" else "Force pressante et pression P = F / S."}</li>
                                    <li>{"Pressure units (Pa, bar, hPa)." if lang=="en" else "Unités de pression (Pa, bar, hPa)."}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>I. {"Force Concept" if lang=="en" else "Notion de Force"}</strong> (1. {"Definition" if lang=="en" else "Définition"}, 2. {"Force vector" if lang=="en" else "Vecteur force"})<br>
                                <strong>II. {"Classification" if lang=="en" else "Classification"}</strong> (1. {"Contact forces" if lang=="en" else "Forces de contact"}, 2. {"Distance forces" if lang=="en" else "Forces à distance"}, 3. {"Internal/External" if lang=="en" else "Intérieures/Extérieures"})<br>
                                <strong>III. {"Pressing Force & Pressure" if lang=="en" else "Force Pressante & Pression"}</strong> (1. {"P = F/S" if lang=="en" else "Formule P = F/S"}, 2. {"Pressure units" if lang=="en" else "Unités"})
                            </td>
                            <td>
                                <ul>
                                    <li>{"Springs, wooden blocks, balloons" if lang=="en" else "Ressorts, blocs de bois, ballons"}</li>
                                    <li>{"Syringe and digital manometer" if lang=="en" else "Seringue et manomètre à affichage"}</li>
                                    <li>{"Sand tray, weights, air pump" if lang=="en" else "Bac à sable, masses, pompe à vide"}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>{"Activities:" if lang=="en" else "Activités :"}</strong> {"Teacher demonstrates pressure variations on sand. Students perform force classification and calculate pressure." if lang=="en" else "Démonstrations expérimentales sur bac à sable. L'apprenant classifie les forces et calcule la pression."}<br>
                                <strong>{"Evaluation:" if lang=="en" else "Évaluation :"}</strong> {"Formative problem sets and pressure unit conversions." if lang=="en" else "Exercices d'application et conversions d'unités."}
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

    # ---------------- PAGE 3: MECHANICS UNITS 3 & 4 ----------------
    p3 = f"""
    <div class="page">
        <div>
            {render_official_header("Common Core" if lang=="en" else "Tronc Commun", "Physics Component" if lang=="en" else "Composante Physique", 2, lang)}
            <div class="overview-box">
                <div class="overview-title">{"Part 1: Mechanics • Module 2: Motion and Inertia Principle (10 Hours)" if lang=="en" else "Partie 1 : Mécanique • Axe 2 : Le Mouvement et le Principe d'Inertie (10 Heures)"}</div>
            </div>

            <!-- UNIT 3 -->
            <div class="unit-block">
                <div class="unit-banner">
                    <span>{"Unit 3: Motion" if lang=="en" else "Unité 3 : Le Mouvement"}</span>
                    <span>6 {"Hours" if lang=="en" else "Heures"}</span>
                </div>
                <div class="unit-prereq-problem">
                    <div class="prereq-col">
                        <div class="block-title">{"Prerequisites:" if lang=="en" else "Prérequis :"}</div>
                        {"Average speed; road safety; uniform/accelerated motion; translation vs rotation." if lang=="en" else "Vitesse moyenne ; sécurité routière ; mouvements uniforme, accéléré et retardé ; translation et rotation."}
                    </div>
                    <div class="problem-col">
                        <div class="block-title">{"Problem Situation:" if lang=="en" else "Situation-Problème :"}</div>
                        {"An escalator rider is at rest relative to the stairs but in motion relative to Earth. What defines relativity of motion? How is velocity represented?" if lang=="en" else "Un usager d'escalator est immobile par rapport aux marches mais en mouvement par rapport au sol. Que traduit la relativité du mouvement ?"}
                    </div>
                </div>
                <table class="pedagogical-table">
                    <thead><tr><th style="width:25%;">{"Objectives" if lang=="en" else "Objectifs"}</th><th style="width:25%;">{"Contents" if lang=="en" else "Contenus"}</th><th style="width:25%;">{"Didactic Materials" if lang=="en" else "Matériel Didactique"}</th><th style="width:25%;">{"Activities & Evaluation" if lang=="en" else "Activités & Évaluation"}</th></tr></thead>
                    <tbody>
                        <tr>
                            <td>
                                <ul>
                                    <li>{"Reference frame (space and time frames)." if lang=="en" else "Référentiel d'étude (espace et temps)."}</li>
                                    <li>{"Trajectory and types of motion." if lang=="en" else "Trajectoire et types de mouvements."}</li>
                                    <li>{"Average and instantaneous speed." if lang=="en" else "Vitesse moyenne et instantanée."}</li>
                                    <li>{"Instantaneous velocity vector representation." if lang=="en" else "Vecteur vitesse instantanée."}</li>
                                    <li>{"Uniform rectilinear motion equation: x(t) = v·t + x₀." if lang=="en" else "Équation horaire x(t) = v·t + x₀."}</li>
                                    <li>{"Uniform circular motion (period, frequency)." if lang=="en" else "Mouvement circulaire uniforme (T, f)."}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>I. {"Relativity of Motion" if lang=="en" else "Relativité du Mouvement"}</strong> (1. {"Reference body" if lang=="en" else "Solide de référence"}, 2. {"Space/time frame" if lang=="en" else "Repères"}, 3. {"Trajectory" if lang=="en" else "Trajectoire"})<br>
                                <strong>II. {"Velocity" if lang=="en" else "Vitesse"}</strong> (1. {"Average speed" if lang=="en" else "Vitesse moyenne"}, 2. {"Instantaneous velocity vector" if lang=="en" else "Vecteur vitesse"})<br>
                                <strong>III. {"Uniform Rectilinear Motion" if lang=="en" else "Mouvement Rectiligne Uniforme"}</strong> (1. {"Characteristics" if lang=="en" else "Propriétés"}, 2. {"Time equation" if lang=="en" else "Équation horaire"})<br>
                                <strong>IV. {"Uniform Circular Motion" if lang=="en" else "Mouvement Circulaire Uniforme"}</strong>
                            </td>
                            <td>
                                <ul>
                                    <li>{"Air cushion table, pucks, spark timer" if lang=="en" else "Table à coussin d'air, mobiles autoporteurs"}</li>
                                    <li>{"Avimeca motion tracking software, webcam" if lang=="en" else "Logiciel Avimeca, caméra numérique"}</li>
                                    <li>{"Tracing paper, metric rulers, chronometers" if lang=="en" else "Papier millimétré, règles, chronomètres"}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>{"Activities:" if lang=="en" else "Activités :"}</strong> {"Analyze spark records to compute v_i = M_(i-1)M_(i+1) / (2τ). Draw velocity vectors and write x(t) equations." if lang=="en" else "Exploitation d'enregistrements étincelés pour calculer v_i et tracer les vecteurs vitesse."}<br>
                                <strong>{"Evaluation:" if lang=="en" else "Évaluation :"}</strong> {"Trajectory analysis exercises and time equation problems." if lang=="en" else "Exercices sur les équations horaires et vitesses."}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- UNIT 4 -->
            <div class="unit-block">
                <div class="unit-banner">
                    <span>{"Unit 4: The Principle of Inertia" if lang=="en" else "Unité 4 : Le Principe d'Inertie"}</span>
                    <span>4 {"Hours" if lang=="en" else "Heures"}</span>
                </div>
                <div class="unit-prereq-problem">
                    <div class="prereq-col">
                        <div class="block-title">{"Prerequisites:" if lang=="en" else "Prérequis :"}</div>
                        {"Forces, velocity vector, trajectory, reference frames." if lang=="en" else "Forces, vecteur vitesse, trajectoire, repères d'espace."}
                    </div>
                    <div class="problem-col">
                        <div class="block-title">{"Problem Situation:" if lang=="en" else "Situation-Problème :"}</div>
                        {"Bus passengers jerk forward when brakes are applied. Is a force necessary to maintain motion? What is the center of inertia?" if lang=="en" else "Les passagers d'un bus sont projetés en avant au freinage. Faut-il une force pour maintenir la vitesse ?"}
                    </div>
                </div>
                <table class="pedagogical-table">
                    <thead><tr><th style="width:25%;">{"Objectives" if lang=="en" else "Objectifs"}</th><th style="width:25%;">{"Contents" if lang=="en" else "Contenus"}</th><th style="width:25%;">{"Didactic Materials" if lang=="en" else "Matériel Didactique"}</th><th style="width:25%;">{"Activities & Evaluation" if lang=="en" else "Activités & Évaluation"}</th></tr></thead>
                    <tbody>
                        <tr>
                            <td>
                                <ul>
                                    <li>{"Identify the center of inertia G of a solid." if lang=="en" else "Identifier le centre d'inertie G d'un solide."}</li>
                                    <li>{"Define mechanically isolated and semi-isolated systems." if lang=="en" else "Définir les systèmes isolés et pseudo-isolés."}</li>
                                    <li>{"State and apply the Principle of Inertia (Newton's 1st Law)." if lang=="en" else "Énoncer et appliquer le principe d'inertie."}</li>
                                    <li>{"Apply the barycentric center of mass formula." if lang=="en" else "Appliquer la relation barycentrique."}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>I. {"Center of Inertia G" if lang=="en" else "Centre d'Inertie G"}</strong> (1. {"Definition" if lang=="en" else "Définition"}, 2. {"Motion of G vs other points" if lang=="en" else "Mouvement de G et d'autres points"})<br>
                                <strong>II. {"Principle of Inertia" if lang=="en" else "Principe d'Inertie"}</strong> (1. {"Semi-isolated system" if lang=="en" else "Système pseudo-isolé"}, 2. {"1st Law statement: ΣF_ext = 0 ⇔ v_G = const" if lang=="en" else "Énoncé : ΣF_ext = 0 ⇔ v_G = Cte"})<br>
                                <strong>III. {"Center of Mass" if lang=="en" else "Centre de Masse"}</strong> (1. {"Barycentric relation" if lang=="en" else "Relation barycentrique"}, 2. {"Compound systems" if lang=="en" else "Systèmes composés"})
                            </td>
                            <td>
                                <ul>
                                    <li>{"Air cushion table with self-supporting pucks" if lang=="en" else "Table à coussin d'air et mobiles"}</li>
                                    <li>{"Puck with eccentric mass / coupled pucks" if lang=="en" else "Mobile à masse excentrée / mobiles liés"}</li>
                                    <li>{"Spark recording paper and rulers" if lang=="en" else "Feuilles d'enregistrement et règles"}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>{"Activities:" if lang=="en" else "Activités :"}</strong> {"Record motion of asymmetric glider; verify that G follows uniform rectilinear motion while the body rotates." if lang=="en" else "Enregistrement du mouvement d'un mobile asymétrique ; mise en évidence du mouvement rectiligne de G."}<br>
                                <strong>{"Evaluation:" if lang=="en" else "Évaluation :"}</strong> {"Problem sets on center of mass and isolated systems." if lang=="en" else "Exercices sur le principe d'inertie et calcul de centre de masse."}
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

    # ---------------- PAGE 4: MECHANICS UNITS 5 & 6 ----------------
    p4 = f"""
    <div class="page">
        <div>
            {render_official_header("Common Core" if lang=="en" else "Tronc Commun", "Physics Component" if lang=="en" else "Composante Physique", 3, lang)}
            <div class="overview-box">
                <div class="overview-title">{"Part 1: Mechanics • Module 3: Equilibrium of Solid Bodies (12 Hours)" if lang=="en" else "Partie 1 : Mécanique • Axe 3 : Équilibre des Corps Solides (12 Heures)"}</div>
            </div>

            <!-- UNIT 5 -->
            <div class="unit-block">
                <div class="unit-banner">
                    <span>{"Unit 5: Equilibrium of a Solid Subject to Two Forces" if lang=="en" else "Unité 5 : Équilibre d'un Corps Solide Soumis à Deux Forces"}</span>
                    <span>3 {"Hours" if lang=="en" else "Heures"}</span>
                </div>
                <div class="unit-prereq-problem">
                    <div class="prereq-col">
                        <div class="block-title">{"Prerequisites:" if lang=="en" else "Prérequis :"}</div>
                        {"Forces, vectors, body weight, action-reaction." if lang=="en" else "Forces, vecteurs, poids d'un corps, actions réciproques."}
                    </div>
                    <div class="problem-col">
                        <div class="block-title">{"Problem Situation:" if lang=="en" else "Situation-Problème :"}</div>
                        {"Automobile springs ensure ride comfort and balance. What characterizes a spring? Why do ships float on water?" if lang=="en" else "Les ressorts assurent la suspension et l'équilibre des véhicules. Comment caractériser un ressort ? Pourquoi les navires flottent-ils ?"}
                    </div>
                </div>
                <table class="pedagogical-table">
                    <thead><tr><th style="width:25%;">{"Objectives" if lang=="en" else "Objectifs"}</th><th style="width:25%;">{"Contents" if lang=="en" else "Contenus"}</th><th style="width:25%;">{"Didactic Materials" if lang=="en" else "Matériel Didactique"}</th><th style="width:25%;">{"Activities & Evaluation" if lang=="en" else "Activités & Évaluation"}</th></tr></thead>
                    <tbody>
                        <tr>
                            <td>
                                <ul>
                                    <li>{"Equilibrium condition under 2 forces: F₁ + F₂ = 0." if lang=="en" else "Condition d'équilibre sous 2 forces : F₁ + F₂ = 0."}</li>
                                    <li>{"Hooke's spring tension law: T = k·|Δl|." if lang=="en" else "Tension d'un ressort et raideur k : T = k·|Δl|."}</li>
                                    <li>{"Archimedes' upthrust: F_A = ρ_fluid · V · g." if lang=="en" else "Poussée d'Archimède : F_A = ρ·V·g."}</li>
                                    <li>{"Static friction coefficient and friction angle φ." if lang=="en" else "Frottement statique et angle de frottement."}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>I. {"2-Force Equilibrium" if lang=="en" else "Équilibre sous 2 Forces"}</strong> (1. {"Equilibrium condition" if lang=="en" else "Condition vectorielle"})<br>
                                <strong>II. {"Spring Force" if lang=="en" else "Force Élastique du Ressort"}</strong> (1. {"Hooke's Law" if lang=="en" else "Loi de Hooke"}, 2. {"Stiffness k" if lang=="en" else "Raideur k"})<br>
                                <strong>III. {"Fluid Thrust & Friction" if lang=="en" else "Poussée d'Archimède et Frottement"}</strong> (1. {"Archimedes' law" if lang=="en" else "Théorème d'Archimède"}, 2. {"Friction on plane" if lang=="en" else "Frottement sur plan"})
                            </td>
                            <td>
                                <ul>
                                    <li>{"Helical springs of varied stiffness, slotted masses" if lang=="en" else "Ressorts de diverses raideurs, masses marquées"}</li>
                                    <li>{"Dynamometers, test tube, water, oil" if lang=="en" else "Dynamomètres, éprouvettes, eau, huile"}</li>
                                    <li>{"Inclined plane apparatus with wooden block" if lang=="en" else "Plan incliné avec bloc de frottement"}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>{"Activities:" if lang=="en" else "Activités :"}</strong> {"Plot T = f(Δl) to determine stiffness k. Measure apparent weight loss in liquid to verify Archimedes' principle." if lang=="en" else "Tracé de T = f(Δl) pour déterminer k. Mesure du poids apparent pour vérifier la poussée d'Archimède."}<br>
                                <strong>{"Evaluation:" if lang=="en" else "Évaluation :"}</strong> {"Spring calibration exercises and floating bodies problems." if lang=="en" else "Exercices d'étalonnage de ressorts et flottaison."}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- UNIT 6 -->
            <div class="unit-block">
                <div class="unit-banner">
                    <span>{"Unit 6: Equilibrium under Three Non-Parallel Forces" if lang=="en" else "Unité 6 : Équilibre d'un Solide Soumis à Trois Forces Non Parallèles"}</span>
                    <span>4 {"Hours" if lang=="en" else "Heures"}</span>
                </div>
                <div class="unit-prereq-problem">
                    <div class="prereq-col">
                        <div class="block-title">{"Prerequisites:" if lang=="en" else "Prérequis :"}</div>
                        {"2-force equilibrium, vector addition, orthogonal projection." if lang=="en" else "Équilibre sous 2 forces, somme vectorielle, projection orthogonale."}
                    </div>
                    <div class="problem-col">
                        <div class="block-title">{"Problem Situation:" if lang=="en" else "Situation-Problème :"}</div>
                        {"A rock climber suspended by ropes stays in equilibrium. What mathematical conditions ensure equilibrium under 3 forces?" if lang=="en" else "Un alpiniste suspendu à des cordes est en équilibre statique. Quelles sont les conditions mathématiques d'équilibre sous 3 forces ?"}
                    </div>
                </div>
                <table class="pedagogical-table">
                    <thead><tr><th style="width:25%;">{"Objectives" if lang=="en" else "Objectifs"}</th><th style="width:25%;">{"Contents" if lang=="en" else "Contenus"}</th><th style="width:25%;">{"Didactic Materials" if lang=="en" else "Matériel Didactique"}</th><th style="width:25%;">{"Activities & Evaluation" if lang=="en" else "Activités & Évaluation"}</th></tr></thead>
                    <tbody>
                        <tr>
                            <td>
                                <ul>
                                    <li>{"Coplanarity and concurrency conditions." if lang=="en" else "Conditions de coplanarité et concourance."}</li>
                                    <li>{"Vector equilibrium condition: F₁ + F₂ + F₃ = 0." if lang=="en" else "Condition vectorielle : F₁ + F₂ + F₃ = 0."}</li>
                                    <li>{"Geometric resolution: closed vector polygon." if lang=="en" else "Méthode géométrique du dynamique fermé."}</li>
                                    <li>{"Analytical resolution: projection on Ox and Oy." if lang=="en" else "Méthode analytique de projection sur Ox et Oy."}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>I. {"Experimental Study" if lang=="en" else "Étude Expérimentale"}</strong> (1. {"Concurrency" if lang=="en" else "Concourance"}, 2. {"Coplanarity" if lang=="en" else "Coplanarité"})<br>
                                <strong>II. {"Equilibrium Conditions" if lang=="en" else "Conditions d'Équilibre"}</strong> (1. {"Vector sum" if lang=="en" else "Somme vectorielle"}, 2. {"Closed polygon" if lang=="en" else "Dynamique fermé"})<br>
                                <strong>III. {"Analytical Method" if lang=="en" else "Méthode Analytique"}</strong> (1. {"Projection on axes" if lang=="en" else "Projection sur les axes"}, 2. {"Resolution" if lang=="en" else "Résolution"})
                            </td>
                            <td>
                                <ul>
                                    <li>{"Cardboard plate with negligible mass" if lang=="en" else "Plaquette de carton de masse négligeable"}</li>
                                    <li>{"3 dynamometers with hooks, white sheet, protractor" if lang=="en" else "3 dynamomètres, feuille blanche, rapporteur"}</li>
                                    <li>{"Magnetic whiteboard pins and pulleys" if lang=="en" else "Tableau magnétique, poulies et fils"}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>{"Activities:" if lang=="en" else "Activités :"}</strong> {"Assemble 3-force balance on plate. Construct the vector triangle and verify closure. Project forces along Cartesian axes." if lang=="en" else "Montage de 3 forces sur plaquette. Tracé du triangle des forces et projection sur repère cartésien."}<br>
                                <strong>{"Evaluation:" if lang=="en" else "Évaluation :"}</strong> {"Equilibrium problem solving and Supervised Exam 3." if lang=="en" else "Résolution de problèmes de statique et Devoir surveillé 3."}
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

    # ---------------- PAGE 5: MECHANICS UNIT 7 ----------------
    p5 = f"""
    <div class="page">
        <div>
            {render_official_header("Common Core" if lang=="en" else "Tronc Commun", "Physics Component" if lang=="en" else "Composante Physique", 4, lang)}
            <div class="overview-box">
                <div class="overview-title">{"Part 1: Mechanics • Module 3: Equilibrium (Continued)" if lang=="en" else "Partie 1 : Mécanique • Axe 3 : Équilibre des Solides (Suite)"}</div>
            </div>

            <!-- UNIT 7 -->
            <div class="unit-block">
                <div class="unit-banner">
                    <span>{"Unit 7: Equilibrium of a Solid Capable of Rotating Around a Fixed Axis" if lang=="en" else "Unité 7 : Équilibre d'un Corps Solide en Rotation Autour d'un Axe Fixe"}</span>
                    <span>5 {"Hours" if lang=="en" else "Heures"}</span>
                </div>
                <div class="unit-prereq-problem">
                    <div class="prereq-col">
                        <div class="block-title">{"Prerequisites:" if lang=="en" else "Prérequis :"}</div>
                        {"Forces, 2-force and 3-force equilibrium, rotation motion." if lang=="en" else "Actions mécaniques, équilibre sous forces, mouvement de rotation."}
                    </div>
                    <div class="problem-col">
                        <div class="block-title">{"Problem Situation:" if lang=="en" else "Situation-Problème :"}</div>
                        {"When changing a flat tire, drivers use a lug wrench. Why does a longer wrench loosen the bolt more easily? What physical quantity measures rotational effect?" if lang=="en" else "Pour dévisser une roue, le conducteur utilise une clé en croix. Pourquoi une clé plus longue facilite-t-elle la tâche ? Quelle grandeur mesure l'efficacité de rotation ?"}
                    </div>
                </div>
                <table class="pedagogical-table">
                    <thead><tr><th style="width:25%;">{"Objectives" if lang=="en" else "Objectifs"}</th><th style="width:25%;">{"Contents" if lang=="en" else "Contenus"}</th><th style="width:25%;">{"Didactic Materials" if lang=="en" else "Matériel Didactique"}</th><th style="width:25%;">{"Activities & Evaluation" if lang=="en" else "Activités & Évaluation"}</th></tr></thead>
                    <tbody>
                        <tr>
                            <td>
                                <ul>
                                    <li>{"Understand rotational effect of a force." if lang=="en" else "Comprendre l'effet de rotation d'une force."}</li>
                                    <li>{"Moment formula: M_Δ(F) = ± F · d (N·m)." if lang=="en" else "Expression du moment : M_Δ(F) = ± F · d (N·m)."}</li>
                                    <li>{"Theorem of Moments: Σ M_Δ(F) = 0." if lang=="en" else "Théorème des moments : Σ M_Δ(F) = 0."}</li>
                                    <li>{"Couple of two forces: M_Δ = F · d." if lang=="en" else "Couple de deux forces : M_Δ = F · d."}</li>
                                    <li>{"Torsion couple and wire constant C: M_c = -C·θ." if lang=="en" else "Couple de torsion et constante C : M_c = -C·θ."}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>I. {"Moment of a Force" if lang=="en" else "Moment d'une Force"}</strong> (1. {"Rotational effect" if lang=="en" else "Effet rotatif"}, 2. {"Definition & formula M_Δ(F) = ± F·d" if lang=="en" else "Définition et signe"})<br>
                                <strong>II. {"Equilibrium in Rotation" if lang=="en" else "Équilibre en Rotation"}</strong> (1. {"Experimental study on disc" if lang=="en" else "Étude sur disque équilibré"}, 2. {"Theorem of moments: ΣM = 0" if lang=="en" else "Théorème des moments : ΣM = 0"}, 3. {"Full equilibrium conditions" if lang=="en" else "Conditions complètes"})<br>
                                <strong>III. {"Couples of Forces" if lang=="en" else "Les Couples de Forces"}</strong> (1. {"Couple of two forces" if lang=="en" else "Couple de deux forces"}, 2. {"Torsion couple M_c = -C·θ" if lang=="en" else "Couple de torsion M_c = -C·θ"}, 3. {"Torsion constant C" if lang=="en" else "Constante de torsion C"})
                            </td>
                            <td>
                                <ul>
                                    <li>{"Equilibrium disc with ball bearings, perforated bar" if lang=="en" else "Disque d'équilibre à roulement, barre perforée"}</li>
                                    <li>{"Dynamometers, pulleys, weights, threads" if lang=="en" else "Dynamomètres, poulies, fils, masses"}</li>
                                    <li>{"Torsion pendulum apparatus with protractor scale" if lang=="en" else "Appareil à fil de torsion avec cadran gradué"}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>{"Activities:" if lang=="en" else "Activités :"}</strong> {"Vary force distance on equilibrium disc; verify that F₁·d₁ = F₂·d₂. Measure wire torsion angle θ under opposing torque to calculate C." if lang=="en" else "Vérification expérimentale de F₁·d₁ = F₂·d₂ sur disque. Mesure de l'angle de torsion θ pour calculer C."}<br>
                                <strong>{"Evaluation:" if lang=="en" else "Évaluation :"}</strong> {"Moment calculation exercises, crane stability problems, Exam 3." if lang=="en" else "Exercices de moments de forces, stabilité de grues, Devoir 3."}
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

    # ---------------- PAGE 6: ELECTRICITY UNITS 1 & 2 ----------------
    p6 = f"""
    <div class="page">
        <div>
            {render_official_header("Common Core" if lang=="en" else "Tronc Commun", "Physics Component" if lang=="en" else "Composante Physique", 5, lang)}
            <div class="overview-box">
                <div class="overview-title">{"Semester 2: Electricity (Total: 32 Hours) • Module 1: Current and Voltage (6 Hours)" if lang=="en" else "Semestre 2 : Électricité (32 Heures) • Axe 1 : Le Courant et la Tension (6 Heures)"}</div>
            </div>

            <!-- UNIT 1 -->
            <div class="unit-block">
                <div class="unit-banner">
                    <span>{"Unit 1: Direct Electric Current" if lang=="en" else "Unité 1 : Le Courant Électrique Continu"}</span>
                    <span>3 {"Hours" if lang=="en" else "Heures"}</span>
                </div>
                <div class="unit-prereq-problem">
                    <div class="prereq-col">
                        <div class="block-title">{"Prerequisites:" if lang=="en" else "Prérequis :"}</div>
                        {"Atomic structure, electrons, conductors and insulators, multimeters." if lang=="en" else "Structure de l'atome, électrons, conducteurs et isolants, multimètre."}
                    </div>
                    <div class="problem-col">
                        <div class="block-title">{"Problem Situation:" if lang=="en" else "Situation-Problème :"}</div>
                        {"Lightning delivers 100 to 200 kA in a millisecond. What is electric current? How is current intensity defined, measured, and distributed in circuits?" if lang=="en" else "La foudre libère 100 à 200 kA en une milliseconde. Qu'est-ce que le courant électrique ? Comment se conserve l'intensité dans un circuit ?"}
                    </div>
                </div>
                <table class="pedagogical-table">
                    <thead><tr><th style="width:25%;">{"Objectives" if lang=="en" else "Objectifs"}</th><th style="width:25%;">{"Contents" if lang=="en" else "Contenus"}</th><th style="width:25%;">{"Didactic Materials" if lang=="en" else "Matériel Didactique"}</th><th style="width:25%;">{"Activities & Evaluation" if lang=="en" else "Activités & Évaluation"}</th></tr></thead>
                    <tbody>
                        <tr>
                            <td>
                                <ul>
                                    <li>{"Nature of electric current (electrons vs ions)." if lang=="en" else "Nature du courant (électrons / ions)."}</li>
                                    <li>{"Conventional direction (+ to -) & quantity Q = I·t = n·e." if lang=="en" else "Sens conventionnel & charge Q = I·t = n·e."}</li>
                                    <li>{"Current intensity in Amperes (A) & ammeter usage." if lang=="en" else "Intensité en Ampères (A) et ampèremètre."}</li>
                                    <li>{"Kirchhoff's Node Law in series and parallel loops." if lang=="en" else "Loi des nœuds en série et dérivation."}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>I. {"Types of Electricity" if lang=="en" else "Deux Types d'Électricité"}</strong> (1. {"Friction charging" if lang=="en" else "Électrisation par frottement"}, 2. {"Positive/negative" if lang=="en" else "Positive et négative"})<br>
                                <strong>II. {"Direct Current" if lang=="en" else "Courant Continu"}</strong> (1. {"Nature in metals & electrolytes" if lang=="en" else "Nature dans les métaux et électrolytes"}, 2. {"Conventional direction" if lang=="en" else "Sens conventionnel"}, 3. {"Intensity definition" if lang=="en" else "Définition de l'intensité"})<br>
                                <strong>III. {"Current Laws" if lang=="en" else "Lois des Courants"}</strong> (1. {"Series circuit" if lang=="en" else "Circuit série"}, 2. {"Node law in branched circuit: ΣI_in = ΣI_out" if lang=="en" else "Loi des nœuds : ΣI_entrant = ΣI_sortant"})
                            </td>
                            <td>
                                <ul>
                                    <li>{"DC power supplies, lamps, switches, ammeters" if lang=="en" else "Générateurs continus, lampes, ampèremètres"}</li>
                                    <li>{"Ebonite/glass rods, cloth, electroscope" if lang=="en" else "Baguettes de verre/ébonite, électroscope"}</li>
                                    <li>{"Electrolysis cell with NaCl solution" if lang=="en" else "Cuve à électrolyse avec solution NaCl"}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>{"Activities:" if lang=="en" else "Activités :"}</strong> {"Connect ammeters in series; verify Node Law at junctions." if lang=="en" else "Branchement d'ampèremètres en série et vérification de la loi des nœuds."}<br>
                                <strong>{"Evaluation:" if lang=="en" else "Évaluation :"}</strong> {"Node law exercises and ammeter reading calculations." if lang=="en" else "Exercices sur la loi des nœuds et calibres."}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- UNIT 2 -->
            <div class="unit-block">
                <div class="unit-banner">
                    <span>{"Unit 2: Electric Voltage" if lang=="en" else "Unité 2 : La Tension Électrique"}</span>
                    <span>3 {"Hours" if lang=="en" else "Heures"}</span>
                </div>
                <div class="unit-prereq-problem">
                    <div class="prereq-col">
                        <div class="block-title">{"Prerequisites:" if lang=="en" else "Prérequis :"}</div>
                        {"Current, circuit loops, voltmeter usage." if lang=="en" else "Courant électrique, circuits, utilisation du voltmètre."}
                    </div>
                    <div class="problem-col">
                        <div class="block-title">{"Problem Situation:" if lang=="en" else "Situation-Problème :"}</div>
                        {"Electrocardiograms display cardiac pulses as variable voltages. What is voltage? How is AC sinusoidal voltage characterized?" if lang=="en" else "Un électrocardiogramme enregistre les pulsations cardiaques sous forme de tension variable. Qu'est-ce que la tension alternative ?"}
                    </div>
                </div>
                <table class="pedagogical-table">
                    <thead><tr><th style="width:25%;">{"Objectives" if lang=="en" else "Objectifs"}</th><th style="width:25%;">{"Contents" if lang=="en" else "Contenus"}</th><th style="width:25%;">{"Didactic Materials" if lang=="en" else "Matériel Didactique"}</th><th style="width:25%;">{"Activities & Evaluation" if lang=="en" else "Activités & Évaluation"}</th></tr></thead>
                    <tbody>
                        <tr>
                            <td>
                                <ul>
                                    <li>{"Voltage U_AB = V_A - V_B & arrow representation." if lang=="en" else "Tension U_AB = V_A - V_B et flèche de tension."}</li>
                                    <li>{"Algebraic property: U_AB = -U_BA." if lang=="en" else "Caractère algébrique : U_AB = -U_BA."}</li>
                                    <li>{"Loop rule (addition of voltages in loops)." if lang=="en" else "Loi des mailles (additivité des tensions)."}</li>
                                    <li>{"Oscilloscope readings: U_max, U_eff = U_max/√2, T, f." if lang=="en" else "Oscilloscope : U_max, U_eff = U_max/√2, T, f."}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>I. {"Electric Voltage" if lang=="en" else "Tension Électrique"}</strong> (1. {"Definition" if lang=="en" else "Définition"}, 2. {"Voltmeter measurement" if lang=="en" else "Mesure au voltmètre"}, 3. {"Representation" if lang=="en" else "Représentation"})<br>
                                <strong>II. {"Potential & Loop Rule" if lang=="en" else "Potentiel & Loi des Mailles"}</strong> (1. {"Potential difference" if lang=="en" else "Différence de potentiel"}, 2. {"Addition of voltages" if lang=="en" else "Additivité des tensions"})<br>
                                <strong>III. {"Alternating Voltages" if lang=="en" else "Tensions Variables"}</strong> (1. {"Sinusoidal voltage" if lang=="en" else "Tension sinusoïdale"}, 2. {"Oscilloscope display: U_max and T" if lang=="en" else "Mesures de U_max et T à l'oscilloscope"})
                            </td>
                            <td>
                                <ul>
                                    <li>{"Low-frequency generator (GBF), oscilloscope" if lang=="en" else "Générateur GBF, oscilloscope bicourbe"}</li>
                                    <li>{"Digital and analog needle voltmeters" if lang=="en" else "Voltmètres numériques et à aiguille"}</li>
                                    <li>{"Resistors, LEDs, AC/DC power sources" if lang=="en" else "Résistances, DEL, alimentations"}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>{"Activities:" if lang=="en" else "Activités :"}</strong> {"Connect voltmeter in parallel; apply Loop Rule in multi-branch circuits. Measure peak voltage and period on oscilloscope." if lang=="en" else "Branchement en dérivation du voltmètre ; vérification de la loi des mailles ; mesure de U_max et T sur l'oscilloscope."}<br>
                                <strong>{"Evaluation:" if lang=="en" else "Évaluation :"}</strong> {"Oscilloscope reading tests and loop calculations." if lang=="en" else "Exercices d'oscillogrammes et calculs de mailles."}
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

    # ---------------- PAGE 7: ELECTRICITY UNITS 3 & 4 ----------------
    p7 = f"""
    <div class="page">
        <div>
            {render_official_header("Common Core" if lang=="en" else "Tronc Commun", "Physics Component" if lang=="en" else "Composante Physique", 6, lang)}
            <div class="overview-box">
                <div class="overview-title">{"Semester 2: Electricity • Module 2: Circuit Assemblies (13 Hours)" if lang=="en" else "Semestre 2 : Électricité • Axe 2 : Trakibs Électriques (13 Heures)"}</div>
            </div>

            <!-- UNIT 3 -->
            <div class="unit-block">
                <div class="unit-banner">
                    <span>{"Unit 3: Resistor Associations" if lang=="en" else "Unité 3 : Association des Conducteurs Ohmiques"}</span>
                    <span>3 {"Hours" if lang=="en" else "Heures"}</span>
                </div>
                <div class="unit-prereq-problem">
                    <div class="prereq-col">
                        <div class="block-title">{"Prerequisites:" if lang=="en" else "Prérequis :"}</div>
                        {"Current, voltage, Ohm's law, multimeters." if lang=="en" else "Courant, tension, loi d'Ohm, multimètres."}
                    </div>
                    <div class="problem-col">
                        <div class="block-title">{"Problem Situation:" if lang=="en" else "Situation-Problème :"}</div>
                        {"Motherboards contain hundreds of resistors in series and parallel. How do resistors divide voltage, and why is copper preferred for wires?" if lang=="en" else "Une carte mère comprend des centaines de résistances. Comment divisent-elles la tension et pourquoi le cuivre est-il le métal de référence ?"}
                    </div>
                </div>
                <table class="pedagogical-table">
                    <thead><tr><th style="width:25%;">{"Objectives" if lang=="en" else "Objectifs"}</th><th style="width:25%;">{"Contents" if lang=="en" else "Contenus"}</th><th style="width:25%;">{"Didactic Materials" if lang=="en" else "Matériel Didactique"}</th><th style="width:25%;">{"Activities & Evaluation" if lang=="en" else "Activités & Évaluation"}</th></tr></thead>
                    <tbody>
                        <tr>
                            <td>
                                <ul>
                                    <li>{"Ohm's law: U = R·I; conductance G = 1/R (S)." if lang=="en" else "Loi d'Ohm : U = R·I ; conductance G = 1/R (S)."}</li>
                                    <li>{"Equivalent resistance in series: R_eq = Σ R_i." if lang=="en" else "Résistance équivalente en série : R_eq = Σ R_i."}</li>
                                    <li>{"Equivalent resistance in parallel: 1/R_eq = Σ 1/R_i." if lang=="en" else "Résistance équivalente en dérivation : 1/R_eq = Σ 1/R_i."}</li>
                                    <li>{"Conductor resistance formula: R = ρ · l / S." if lang=="en" else "Résistance géométrique d'un fil : R = ρ·l/S."}</li>
                                    <li>{"Voltage divider circuit formula: U₂ = E · R₂ / (R₁ + R₂)." if lang=="en" else "Montage diviseur de tension : U₂ = E·R₂/(R₁+R₂)."}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>I. {"Ohmic Resistor" if lang=="en" else "Conducteur Ohmique"}</strong> (1. {"Definition & Ohm's law" if lang=="en" else "Définition & loi d'Ohm"}, 2. {"Wire resistivity R = ρ·l/S" if lang=="en" else "Résistivité R = ρ·l/S"})<br>
                                <strong>II. {"Resistor Combinations" if lang=="en" else "Associations de Résistances"}</strong> (1. {"Series combination" if lang=="en" else "Association série"}, 2. {"Parallel combination" if lang=="en" else "Association dérivation"})<br>
                                <strong>III. {"Applications" if lang=="en" else "Applications"}</strong> (1. {"Voltage divider circuit" if lang=="en" else "Pont diviseur de tension"}, 2. {"Rheostat" if lang=="en" else "Rhéostat"})
                            </td>
                            <td>
                                <ul>
                                    <li>{"Multimeters, DC power supplies (6V)" if lang=="en" else "Multimètres, alimentations continues (6V)"}</li>
                                    <li>{"Resistor kits of various ohmic values" if lang=="en" else "Boîte de résistances étalonnées"}</li>
                                    <li>{"Wires of identical cross-section but different metals (Cu, Fe, Ni-Cr)" if lang=="en" else "Fils métalliques de divers diamètres et métaux"}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>{"Activities:" if lang=="en" else "Activités :"}</strong> {"Measure equivalent resistance with ohmmeter; assemble a voltage divider and verify theoretical formula." if lang=="en" else "Mesure de R_eq à l'ohmmètre ; réalisation d'un diviseur de tension et vérification de la formule."}<br>
                                <strong>{"Evaluation:" if lang=="en" else "Évaluation :"}</strong> {"Equivalent resistance calculations and voltage divider tests." if lang=="en" else "Exercices sur R_eq et diviseur de tension."}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- UNIT 4 -->
            <div class="unit-block">
                <div class="unit-banner">
                    <span>{"Unit 4: Passive Non-Linear Dipoles" if lang=="en" else "Unité 4 : Dipôles Passifs Non Linéaires"}</span>
                    <span>5 {"Hours" if lang=="en" else "Heures"}</span>
                </div>
                <div class="unit-prereq-problem">
                    <div class="prereq-col">
                        <div class="block-title">{"Prerequisites:" if lang=="en" else "Prérequis :"}</div>
                        {"Current, voltage, Ohm's law, multimeters." if lang=="en" else "Courant, tension, loi d'Ohm, multimètres."}
                    </div>
                    <div class="problem-col">
                        <div class="block-title">{"Problem Situation:" if lang=="en" else "Situation-Problème :"}</div>
                        {"Smartphones and electronic devices use diodes, LEDs, and thermistors. What are passive dipoles, what are their I-V curves, and where are they used?" if lang=="en" else "Les circuits électroniques utilisent des diodes, DEL et thermistances. Que caractérise un dipôle passif et comment exploiter sa courbe I-V ?"}
                    </div>
                </div>
                <table class="pedagogical-table">
                    <thead><tr><th style="width:25%;">{"Objectives" if lang=="en" else "Objectifs"}</th><th style="width:25%;">{"Contents" if lang=="en" else "Contenus"}</th><th style="width:25%;">{"Didactic Materials" if lang=="en" else "Matériel Didactique"}</th><th style="width:25%;">{"Activities & Evaluation" if lang=="en" else "Activités & Évaluation"}</th></tr></thead>
                    <tbody>
                        <tr>
                            <td>
                                <ul>
                                    <li>{"Distinguish active vs passive dipoles." if lang=="en" else "Distinguer dipôles actifs et passifs."}</li>
                                    <li>{"Plot I-V characteristic curve of dipoles." if lang=="en" else "Tracer la caractéristique courant-tension."}</li>
                                    <li>{"Study junction diode (threshold voltage U_s ≈ 0.6V)." if lang=="en" else "Diode à jonction (tension de seuil U_s ≈ 0,6V)."}</li>
                                    <li>{"Study Zener diode (Zener voltage U_Z for voltage regulation)." if lang=="en" else "Diode Zener (régulation de tension)."}</li>
                                    <li>{"Understand sensors: Thermistors (CTN/CTP) and LDR (photoresistor)." if lang=="en" else "Capteurs : Thermistances (CTN) et photorésistances (LDR)."}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>I. {"Dipole Concept" if lang=="en" else "Notion de Dipôle"}</strong> (1. {"Definition" if lang=="en" else "Définition"}, 2. {"Passive dipoles" if lang=="en" else "Dipôles passifs"})<br>
                                <strong>II. {"Characteristic Curve" if lang=="en" else "Caractéristique"}</strong> (1. {"Test circuit" if lang=="en" else "Montage de mesure"}, 2. {"Curve plotting" if lang=="en" else "Tracé graphique"})<br>
                                <strong>III. {"Various Passive Dipoles" if lang=="en" else "Étude de Divers Dipôles"}</strong> (1. {"Incandescent lamp" if lang=="en" else "Lampe"}, 2. {"Semiconductor diode" if lang=="en" else "Diode à jonction"}, 3. {"Zener diode" if lang=="en" else "Diode Zener"}, 4. {"LED" if lang=="en" else "DEL"}, 5. {"VDR varistor" if lang=="en" else "Varistance"}, 6. {"Thermistor" if lang=="en" else "Thermistance"}, 7. {"LDR" if lang=="en" else "Photorésistance"})
                            </td>
                            <td>
                                <ul>
                                    <li>{"Variable DC power supply (0 - 15 V), breadboard" if lang=="en" else "Alimentation continue variable, plaquette"}</li>
                                    <li>{"Diodes (1N4007), Zener diodes, LEDs, thermistors, LDR" if lang=="en" else "Diodes 1N4007, Zener, DEL, thermistances, LDR"}</li>
                                    <li>{"Incandescent lamp, torchlight, hair dryer (for heat)" if lang=="en" else "Lampe, lampe torche, sèche-cheveux (chaleur)"}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>{"Activities:" if lang=="en" else "Activités :"}</strong> {"Record (U, I) points in forward and reverse bias; plot curves on millimeter paper and deduce threshold voltage." if lang=="en" else "Relevé des points (U, I) en sens direct et inverse ; tracé des courbes et détermination de la tension de seuil."}<br>
                                <strong>{"Evaluation:" if lang=="en" else "Évaluation :"}</strong> {"Questions on diode rectification and sensor resistance shifts." if lang=="en" else "Exercices sur le redressement et les capteurs."}
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

    # ---------------- PAGE 8: ELECTRICITY UNITS 5 & 6 ----------------
    p8 = f"""
    <div class="page">
        <div>
            {render_official_header("Common Core" if lang=="en" else "Tronc Commun", "Physics Component" if lang=="en" else "Composante Physique", 7, lang)}
            <div class="overview-box">
                <div class="overview-title">{"Semester 2: Electricity • Module 2 & 3: Active Dipoles and Transistors (14 Hours)" if lang=="en" else "Semestre 2 : Électricité • Axes 2 & 3 : Dipôles Actifs et Transistors (14 Heures)"}</div>
            </div>

            <!-- UNIT 5 -->
            <div class="unit-block">
                <div class="unit-banner">
                    <span>{"Unit 5: Active Dipoles" if lang=="en" else "Unité 5 : Les Dipôles Actifs"}</span>
                    <span>4 {"Hours" if lang=="en" else "Heures"}</span>
                </div>
                <div class="unit-prereq-problem">
                    <div class="prereq-col">
                        <div class="block-title">{"Prerequisites:" if lang=="en" else "Prérequis :"}</div>
                        {"DC current, Ohm's law, multimeters, passive dipoles." if lang=="en" else "Courant continu, loi d'Ohm, multimètres, dipôles passifs."}
                    </div>
                    <div class="problem-col">
                        <div class="block-title">{"Problem Situation:" if lang=="en" else "Situation-Problème :"}</div>
                        {"Batteries act as generators while electric motors act as receivers. What physical equations govern their performance, and how is the operating point determined?" if lang=="en" else "Les piles agissent en générateurs tandis que les moteurs agissent en récepteurs. Quelles équations régissent leur fonctionnement et comment trouver le point de fonctionnement ?"}
                    </div>
                </div>
                <table class="pedagogical-table">
                    <thead><tr><th style="width:25%;">{"Objectives" if lang=="en" else "Objectifs"}</th><th style="width:25%;">{"Contents" if lang=="en" else "Contenus"}</th><th style="width:25%;">{"Didactic Materials" if lang=="en" else "Matériel Didactique"}</th><th style="width:25%;">{"Activities & Evaluation" if lang=="en" else "Activités & Évaluation"}</th></tr></thead>
                    <tbody>
                        <tr>
                            <td>
                                <ul>
                                    <li>{"Linear generator equation: U_PN = E - r·I." if lang=="en" else "Équation du générateur linéaire : U_PN = E - r·I."}</li>
                                    <li>{"Receiver equation: U_AB = E' + r'·I." if lang=="en" else "Équation du récepteur : U_AB = E' + r'·I."}</li>
                                    <li>{"Determine operating point (I_P, U_P) graphically." if lang=="en" else "Détermination graphique du point de fonctionnement."}</li>
                                    <li>{"Apply Pouillet's Law: I = (ΣE - ΣE') / (ΣR)." if lang=="en" else "Loi de Pouillet : I = (ΣE - ΣE') / (ΣR)."}</li>
                                    <li>{"Series/parallel associations of generators." if lang=="en" else "Association de générateurs (série et dérivation)."}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>I. {"Active Dipole" if lang=="en" else "Dipôle Actif"}</strong> (1. {"Definition" if lang=="en" else "Définition"}, 2. {"Generator characteristic" if lang=="en" else "Caractéristique d'une pile"}, 3. {"EMF E and internal resistance r" if lang=="en" else "f.é.m. E et résistance interne r"})<br>
                                <strong>II. {"Electric Receiver" if lang=="en" else "Le Récepteur"}</strong> (1. {"Definition" if lang=="en" else "Définition"}, 2. {"Back-EMF E' and r'" if lang=="en" else "f.c.é.m. E' et résistance r'"})<br>
                                <strong>III. {"Operating Point" if lang=="en" else "Point de Fonctionnement"}</strong> (1. {"Generator-resistor circuit" if lang=="en" else "Circuit pile-résistance"}, 2. {"Pouillet's Law" if lang=="en" else "Loi de Pouillet"})
                            </td>
                            <td>
                                <ul>
                                    <li>{"Flat 4.5V batteries, DC power supply, resistors" if lang=="en" else "Piles 4,5V, alimentation continue, résistances"}</li>
                                    <li>{"Electrolyzer with copper chloride solution" if lang=="en" else "Électrolyseur avec solution de chlorure de cuivre"}</li>
                                    <li>{"Rheostat, switch, multimeters, millimeter paper" if lang=="en" else "Rhéostat, multimètres, papier millimétré"}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>{"Activities:" if lang=="en" else "Activités :"}</strong> {"Plot load line of battery and resistance line on same graph; find intersection point (I_P, U_P); compare with Pouillet's law." if lang=="en" else "Tracé de la droite de charge et de la droite de la résistance ; repérage du point d'intersection et calcul par Pouillet."}<br>
                                <strong>{"Evaluation:" if lang=="en" else "Évaluation :"}</strong> {"Pouillet's law problems and generator coupling calculations." if lang=="en" else "Exercices de la loi de Pouillet et Devoir surveillé 5."}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- UNIT 6 -->
            <div class="unit-block">
                <div class="unit-banner">
                    <span>{"Unit 6: Simple Electronic Circuits - The Transistor" if lang=="en" else "Unité 6 : Trakibs Électroniques Simples - Le Transistor"}</span>
                    <span>10 {"Hours" if lang=="en" else "Heures"}</span>
                </div>
                <div class="unit-prereq-problem">
                    <div class="prereq-col">
                        <div class="block-title">{"Prerequisites:" if lang=="en" else "Prérequis :"}</div>
                        {"Current, voltage, Ohm's law, diode characteristics." if lang=="en" else "Courant, tension, loi d'Ohm, caractéristiques de diodes."}
                    </div>
                    <div class="problem-col">
                        <div class="block-title">{"Problem Situation:" if lang=="en" else "Situation-Problème :"}</div>
                        {"Modern electronics relies on transistors as microscopic switches and amplifiers. How does an NPN transistor control a large output current with a minute base signal?" if lang=="en" else "L'électronique repose sur le transistor en commutation et amplification. Comment commande-t-il un fort courant par un faible signal de base ?"}
                    </div>
                </div>
                <table class="pedagogical-table">
                    <thead><tr><th style="width:25%;">{"Objectives" if lang=="en" else "Objectifs"}</th><th style="width:25%;">{"Contents" if lang=="en" else "Contenus"}</th><th style="width:25%;">{"Didactic Materials" if lang=="en" else "Matériel Didactique"}</th><th style="width:25%;">{"Activities & Evaluation" if lang=="en" else "Activités & Évaluation"}</th></tr></thead>
                    <tbody>
                        <tr>
                            <td>
                                <ul>
                                    <li>{"Identify terminals of NPN transistor (B, C, E)." if lang=="en" else "Repérer les broches du transistor NPN (B, C, E)."}</li>
                                    <li>{"Current relationship: I_E = I_B + I_C." if lang=="en" else "Relation des courants : I_E = I_B + I_C."}</li>
                                    <li>{"Linear amplification: I_C = β · I_B." if lang=="en" else "Régime amplificateur : I_C = β · I_B."}</li>
                                    <li>{"Switching modes: Blocked (I_B = 0, I_C = 0) vs Saturated." if lang=="en" else "Régime de commutation : Bloqué vs Saturé."}</li>
                                    <li>{"Assemble sensor circuits (light-activated switch with LDR)." if lang=="en" else "Réalisation de circuits capteurs (détecteur à LDR)."}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>I. {"Bipolar Transistor" if lang=="en" else "Le Transistor Bipolaire"}</strong> (1. {"Terminals & symbol" if lang=="en" else "Brochage et symbole"}, 2. {"Current relations I_E = I_B + I_C" if lang=="en" else "Lois des courants"})<br>
                                <strong>II. {"Operating Regimes" if lang=="en" else "Régimes de Fonctionnement"}</strong> (1. {"Linear amplification regime I_C = β·I_B" if lang=="en" else "Amplification I_C = β·I_B"}, 2. {"Saturation and cutoff regimes" if lang=="en" else "Commutation saturé/bloqué"})<br>
                                <strong>III. {"Practical Assemblies" if lang=="en" else "Montages Pratiques"}</strong> (1. {"Twilight automatic switch" if lang=="en" else "Interrupteur crépusculaire"}, 2. {"Temperature alarm" if lang=="en" else "Alarme thermique"})
                            </td>
                            <td>
                                <ul>
                                    <li>{"NPN transistors (2N2222, BC548), breadboard" if lang=="en" else "Transistors NPN (2N2222, BC548), plaquette"}</li>
                                    <li>{"Resistors (1k, 10k, 100k), LEDs, buzzer, relays" if lang=="en" else "Résistances, DEL, avertisseur sonore, relais"}</li>
                                    <li>{"LDR photoresistors, thermistors (CTN), multimeters" if lang=="en" else "Photorésistance LDR, thermistance, multimètres"}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>{"Activities:" if lang=="en" else "Activités :"}</strong> {"Wire transistor circuit; measure I_B and I_C to compute current gain β. Build twilight alarm and test with covered LDR." if lang=="en" else "Câblage du transistor, mesure de I_B et I_C pour calculer le gain β. Montage de l'interrupteur crépusculaire."}<br>
                                <strong>{"Evaluation:" if lang=="en" else "Évaluation :"}</strong> {"Transistor state analysis problems and Supervised Exam 6." if lang=="en" else "Exercices de commutation et Devoir surveillé 6."}
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

    # ---------------- PAGE 9: CHEMISTRY UNIT 1 ----------------
    p9 = f"""
    <div class="page">
        <div>
            {render_official_header("Common Core" if lang=="en" else "Tronc Commun", "Chemistry Component" if lang=="en" else "Composante Chimie", 8, lang)}
            <div class="overview-box">
                <div class="overview-title">{"Chemistry Component • Semester 1: Chemistry Around Us (Total: 10 Hours)" if lang=="en" else "Composante Chimie • Semestre 1 : La Chimie Autour de Nous (10 Heures)"}</div>
                <div class="overview-grid">
                    <div>
                        <strong>{"Competencies:" if lang=="en" else "Compétences Visées :"}</strong>
                        {"Relate everyday products to chemistry principles. Safe use of lab equipment. Chemical synthesis protocols following safety rules. Experimental methods." if lang=="en" else "Relier les produits du quotidien aux théories chimiques. Respecter les règles de sécurité au laboratoire. Réaliser des protocoles de synthèse et d'extraction."}
                    </div>
                    <div>
                        <strong>{"Semester Units:" if lang=="en" else "Unités du Semestre :"}</strong>
                        1. {"Chemical Species (2h)" if lang=="en" else "Espèces chimiques (2h)"} • 
                        2. {"Extraction & Separation (3h)" if lang=="en" else "Extraction et séparation (3h)"} • 
                        3. {"Chemical Synthesis (3h)" if lang=="en" else "Synthèse d'espèces (3h)"} • 
                        4. {"Atomic Model (2h)" if lang=="en" else "Modèle de l'atome (2h)"} • 
                        5. {"Molecular Geometry (2h)" if lang=="en" else "Géométrie des molécules (2h)"} • 
                        6. {"Periodic Classification (4h)" if lang=="en" else "Tableau périodique (4h)"}
                    </div>
                </div>
            </div>

            <!-- UNIT 1 -->
            <div class="unit-block">
                <div class="unit-banner">
                    <span>{"Unit 1: Chemical Species" if lang=="en" else "Unité 1 : Les Espèces Chimiques"}</span>
                    <span>2 {"Hours" if lang=="en" else "Heures"}</span>
                </div>
                <div class="unit-prereq-problem">
                    <div class="prereq-col">
                        <div class="block-title">{"Prerequisites:" if lang=="en" else "Prérequis :"}</div>
                        {"States of matter, mixtures vs pure substances, combustion." if lang=="en" else "États de la matière, corps purs et mélanges, combustions."}
                    </div>
                    <div class="problem-col">
                        <div class="block-title">{"Problem Situation:" if lang=="en" else "Situation-Problème :"}</div>
                        {"Natural products and manufactured goods contain myriad substances. How do chemists classify chemical species and test for water, glucose, and starch?" if lang=="en" else "Les produits naturels et manufacturés contiennent de nombreuses espèces. Comment les classifier et tester la présence d'eau ou de glucose ?"}
                    </div>
                </div>
                <table class="pedagogical-table">
                    <thead><tr><th style="width:25%;">{"Objectives" if lang=="en" else "Objectifs"}</th><th style="width:25%;">{"Contents" if lang=="en" else "Contenus"}</th><th style="width:25%;">{"Didactic Materials" if lang=="en" else "Matériel Didactique"}</th><th style="width:25%;">{"Activities & Evaluation" if lang=="en" else "Activités & Évaluation"}</th></tr></thead>
                    <tbody>
                        <tr>
                            <td>
                                <ul>
                                    <li>{"Define chemical species and chemical substance." if lang=="en" else "Définir l'espèce chimique."}</li>
                                    <li>{"Classify species into natural and synthetic." if lang=="en" else "Classifier en espèces naturelles et synthétiques."}</li>
                                    <li>{"Identification test for water (anhydrous CuSO₄ turns blue)." if lang=="en" else "Test de l'eau au sulfate de cuivre anhydre (bleu)."}</li>
                                    <li>{"Identification test for glucose (Fehling test: red precipitate)." if lang=="en" else "Test du glucose à la liqueur de Fehling (rouge brique)."}</li>
                                    <li>{"Identification test for acidity (pH paper / indicators)." if lang=="en" else "Test d'acidité au papier pH."}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>I. {"Concept of Chemical Species" if lang=="en" else "Notion d'Espèce Chimique"}</strong> (1. {"Definition" if lang=="en" else "Définition"}, 2. {"Chemical tests" if lang=="en" else "Tests d'identification"})<br>
                                <strong>II. {"Classification" if lang=="en" else "Classification"}</strong> (1. {"Natural chemical species" if lang=="en" else "Espèces naturelles"}, 2. {"Synthetic chemical species" if lang=="en" else "Espèces synthétiques"}, 3. {"Artificial species" if lang=="en" else "Espèces artificielles"})
                            </td>
                            <td>
                                <ul>
                                    <li>{"Anhydrous copper sulfate, Fehling solution A & B" if lang=="en" else "Sulfate de cuivre anhydre, liqueur de Fehling"}</li>
                                    <li>{"Orange fruit juice, apple slice, potato, salt" if lang=="en" else "Jus d'orange, pomme, pomme de terre, sel"}</li>
                                    <li>{"Test tubes, test tube rack, Bunsen burner, pH paper" if lang=="en" else "Tubes à essais, portoir, bec Bunsen, papier pH"}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>{"Activities:" if lang=="en" else "Activités :"}</strong> {"Perform tests for water in fruits with white CuSO₄. Perform Fehling test on fruit juices to detect reducing sugars." if lang=="en" else "Réalisation des tests de caractérisation de l'eau et du glucose sur des produits alimentaires."}<br>
                                <strong>{"Evaluation:" if lang=="en" else "Évaluation :"}</strong> {"Diagnostic quiz on tests and natural/synthetic identification." if lang=="en" else "Questions orales et Devoir surveillé 1."}
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

    # ---------------- PAGE 10: CHEMISTRY UNITS 2 & 3 ----------------
    p10 = f"""
    <div class="page">
        <div>
            {render_official_header("Common Core" if lang=="en" else "Tronc Commun", "Chemistry Component" if lang=="en" else "Composante Chimie", 9, lang)}
            <div class="overview-box">
                <div class="overview-title">{"Semester 1: Chemistry • Module 1: Extraction, Separation and Synthesis (6 Hours)" if lang=="en" else "Semestre 1 : Chimie • Axe 1 : Extraction, Séparation et Synthèse (6 Heures)"}</div>
            </div>

            <!-- UNIT 2 -->
            <div class="unit-block">
                <div class="unit-banner">
                    <span>{"Unit 2: Extraction, Separation and Detection of Chemical Species" if lang=="en" else "Unité 2 : Extraction, Séparation et Identification d'Espèces Chimiques"}</span>
                    <span>3 {"Hours" if lang=="en" else "Heures"}</span>
                </div>
                <div class="unit-prereq-problem">
                    <div class="prereq-col">
                        <div class="block-title">{"Prerequisites:" if lang=="en" else "Prérequis :"}</div>
                        {"Mixtures, solubility, boiling point, density." if lang=="en" else "Mélanges, solubilité, température d'ébullition, densité."}
                    </div>
                    <div class="problem-col">
                        <div class="block-title">{"Problem Situation:" if lang=="en" else "Situation-Problème :"}</div>
                        {"Brewing tea extracts flavors and colors using hot water as solvent. What are extraction techniques, and how does Thin Layer Chromatography separate components?" if lang=="en" else "L'infusion du thé extrait arômes et colorants par l'eau. Quelles sont les techniques d'extraction et de séparation par CCM ?"}
                    </div>
                </div>
                <table class="pedagogical-table">
                    <thead><tr><th style="width:25%;">{"Objectives" if lang=="en" else "Objectifs"}</th><th style="width:25%;">{"Contents" if lang=="en" else "Contenus"}</th><th style="width:25%;">{"Didactic Materials" if lang=="en" else "Matériel Didactique"}</th><th style="width:25%;">{"Activities & Evaluation" if lang=="en" else "Activités & Évaluation"}</th></tr></thead>
                    <tbody>
                        <tr>
                            <td>
                                <ul>
                                    <li>{"Know extraction techniques (solvent extraction, hydrodistillation)." if lang=="en" else "Techniques d'extraction (par solvant, hydrodistillation)."}</li>
                                    <li>{"Use a separatory funnel properly based on density." if lang=="en" else "Utilisation de l'ampoule à décanter."}</li>
                                    <li>{"Thin-Layer Chromatography (TLC): stationary & mobile phase." if lang=="en" else "Chromatographie sur couche mince (CCM)."}</li>
                                    <li>{"Calculate frontal ratio: R_f = h / H." if lang=="en" else "Calcul du rapport frontal : R_f = h / H."}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>I. {"Extraction Techniques" if lang=="en" else "Techniques d'Extraction"}</strong> (1. {"Solvent extraction" if lang=="en" else "Extraction par solvant"}, 2. {"Hydrodistillation setup" if lang=="en" else "Montage d'hydrodistillation"})<br>
                                <strong>II. {"Separation" if lang=="en" else "Séparation"}</strong> (1. {"Liquid-liquid extraction" if lang=="en" else "Extraction liquide-liquide"}, 2. {"Separatory funnel usage" if lang=="en" else "Ampoule à décanter"})<br>
                                <strong>III. {"Chromatography (TLC)" if lang=="en" else "Chromatographie (CCM)"}</strong> (1. {"Principle" if lang=="en" else "Principe"}, 2. {"Development & visualization" if lang=="en" else "Révélation"}, 3. {"Frontal ratio R_f" if lang=="en" else "Rapport frontal R_f"})
                            </td>
                            <td>
                                <ul>
                                    <li>{"Hydrodistillation glassware: round flask, condenser" if lang=="en" else "Montage d'hydrodistillation : ballon, réfrigérant"}</li>
                                    <li>{"Lavender flowers, cyclohexane, dichloromethane" if lang=="en" else "Fleurs de lavande, cyclohexane, dichlorométhane"}</li>
                                    <li>{"TLC silica plates, developing tank, UV lamp, capillary tubes" if lang=="en" else "Plaques de silice CCM, cuve à élution, lampe UV"}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>{"Activities:" if lang=="en" else "Activités :"}</strong> {"Perform hydrodistillation of lavender; separate organic phase in separatory funnel; run TLC and measure R_f." if lang=="en" else "Hydrodistillation de la lavande ; séparation à l'ampoule à décanter ; CCM et calcul des rapports frontaux R_f."}<br>
                                <strong>{"Evaluation:" if lang=="en" else "Évaluation :"}</strong> {"TLC chromatogram reading and extraction protocol tests." if lang=="en" else "Lecture de chromatogrammes et Devoir surveillé 1."}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- UNIT 3 -->
            <div class="unit-block">
                <div class="unit-banner">
                    <span>{"Unit 3: Synthesis of Chemical Species" if lang=="en" else "Unité 3 : Synthèse d'Espèces Chimiques"}</span>
                    <span>3 {"Hours" if lang=="en" else "Heures"}</span>
                </div>
                <div class="unit-prereq-problem">
                    <div class="prereq-col">
                        <div class="block-title">{"Prerequisites:" if lang=="en" else "Prérequis :"}</div>
                        {"Chemical species, extraction, glassware, reflux heating." if lang=="en" else "Espèces chimiques, extraction, verrerie, chauffage."}
                    </div>
                    <div class="problem-col">
                        <div class="block-title">{"Problem Situation:" if lang=="en" else "Situation-Problème :"}</div>
                        {"Industrial chemistry produces fragrances identical to natural ones. Why synthesize species instead of extracting them, and how is reflux heating carried out?" if lang=="en" else "L'industrie synthétise des molécules identiques aux arômes naturels. Pourquoi synthétiser au lieu d'extraire, et quel est le rôle du chauffage à reflux ?"}
                    </div>
                </div>
                <table class="pedagogical-table">
                    <thead><tr><th style="width:25%;">{"Objectives" if lang=="en" else "Objectifs"}</th><th style="width:25%;">{"Contents" if lang=="en" else "Contenus"}</th><th style="width:25%;">{"Didactic Materials" if lang=="en" else "Matériel Didactique"}</th><th style="width:25%;">{"Activities & Evaluation" if lang=="en" else "Activités & Évaluation"}</th></tr></thead>
                    <tbody>
                        <tr>
                            <td>
                                <ul>
                                    <li>{"Understand motives for chemical synthesis (cost, purity, supply)." if lang=="en" else "Motifs de la synthèse chimique (coût, abondance)."}</li>
                                    <li>{"Assemble reflux heating apparatus safely." if lang=="en" else "Réaliser un montage de chauffage à reflux."}</li>
                                    <li>{"Synthesize linalyl acetate (lavender scent)." if lang=="en" else "Synthétiser l'acétate de linalyle (arôme de lavande)."}</li>
                                    <li>{"Compare synthetic product to natural extract via TLC." if lang=="en" else "Comparer le produit synthétisé à l'extrait par CCM."}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>I. {"Necessity of Synthesis" if lang=="en" else "Nécessité de la Synthèse"}</strong> (1. {"Cost and availability" if lang=="en" else "Coût et disponibilité"}, 2. {"Environmental conservation" if lang=="en" else "Préservation des ressources"})<br>
                                <strong>II. {"Reflux Synthesis" if lang=="en" else "Synthèse à Reflux"}</strong> (1. {"Principle of reflux without vapor loss" if lang=="en" else "Rôle du reflux sans perte de matière"}, 2. {"Synthesis protocol" if lang=="en" else "Protocole expérimental"})<br>
                                <strong>III. {"Characterization" if lang=="en" else "Identification"}</strong> (1. {"Washing & drying" if lang=="en" else "Lavage et séchage"}, 2. {"TLC comparison" if lang=="en" else "Identification comparative par CCM"})
                            </td>
                            <td>
                                <ul>
                                    <li>{"Reflux setup: heating mantle, Liebig condenser, boiling stones" if lang=="en" else "Montage à reflux : chauffe-ballon, réfrigérant, pierre ponce"}</li>
                                    <li>{"Linalool, acetic anhydride, sodium hydrogencarbonate" if lang=="en" else "Linalol, anhydride acétique, hydrogénocarbonate de sodium"}</li>
                                    <li>{"Separatory funnels, beakers, TLC equipment" if lang=="en" else "Ampoules à décanter, béchers, matériel de CCM"}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>{"Activities:" if lang=="en" else "Activités :"}</strong> {"Heat linalool and acetic anhydride under reflux for 20 min. Wash organic phase and spot TLC against natural lavender oil." if lang=="en" else "Chauffage à reflux, décantation et lavage, puis dépôt CCM comparatif avec l'huile essentielle de lavande."}<br>
                                <strong>{"Evaluation:" if lang=="en" else "Évaluation :"}</strong> {"Questions on reflux role, washing steps, and TLC analysis." if lang=="en" else "Questions sur le rôle du réfrigérant et Devoir surveillé 1."}
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

    # ---------------- PAGE 11: CHEMISTRY UNITS 4 & 5 ----------------
    p11 = f"""
    <div class="page">
        <div>
            {render_official_header("Common Core" if lang=="en" else "Tronc Commun", "Chemistry Component" if lang=="en" else "Composante Chimie", 10, lang)}
            <div class="overview-box">
                <div class="overview-title">{"Semester 1: Chemistry • Module 2: The Atom and Molecular Geometry (12 Hours)" if lang=="en" else "Semestre 1 : Chimie • Axe 2 : Modèle de l'Atome et Géométrie des Molécules (12 Heures)"}</div>
            </div>

            <!-- UNIT 4 -->
            <div class="unit-block">
                <div class="unit-banner">
                    <span>{"Unit 4: The Atomic Model" if lang=="en" else "Unité 4 : Le Modèle de l'Atome"}</span>
                    <span>2 {"Hours" if lang=="en" else "Heures"}</span>
                </div>
                <div class="unit-prereq-problem">
                    <div class="prereq-col">
                        <div class="block-title">{"Prerequisites:" if lang=="en" else "Prérequis :"}</div>
                        {"Atom components, electrons, ions, electrical conductivity." if lang=="en" else "Composants de l'atome, électrons, ions, conduction électrique."}
                    </div>
                    <div class="problem-col">
                        <div class="block-title">{"Problem Situation:" if lang=="en" else "Situation-Problème :"}</div>
                        {"Rutherford discovered the atomic nucleus in 1911. What is the modern model of the atom, how are electrons distributed in shells, and what are isotopes?" if lang=="en" else "Rutherford a découvert le noyau en 1911. Quel est le modèle actuel de l'atome et comment les électrons se répartissent-ils en couches ?"}
                    </div>
                </div>
                <table class="pedagogical-table">
                    <thead><tr><th style="width:25%;">{"Objectives" if lang=="en" else "Objectifs"}</th><th style="width:25%;">{"Contents" if lang=="en" else "Contenus"}</th><th style="width:25%;">{"Didactic Materials" if lang=="en" else "Matériel Didactique"}</th><th style="width:25%;">{"Activities & Evaluation" if lang=="en" else "Activités & Évaluation"}</th></tr></thead>
                    <tbody>
                        <tr>
                            <td>
                                <ul>
                                    <li>{"Constituents of atom: nucleus (protons Z, neutrons N) and electrons." if lang=="en" else "Constituants de l'atome : noyau (Z, N) et électrons."}</li>
                                    <li>{"Nuclide notation ^A_Z X and atomic neutrality." if lang=="en" else "Symbole ^A_Z X et neutralité électrique."}</li>
                                    <li>{"Isotopes definition and atomic mass concentrated in nucleus." if lang=="en" else "Définition des isotopes et masse de l'atome."}</li>
                                    <li>{"Electronic structure in shells (K)², (L)⁸, (M)⁸." if lang=="en" else "Répartition électronique en couches (K)², (L)⁸, (M)⁸."}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>I. {"Atomic Structure" if lang=="en" else "Structure de l'Atome"}</strong> (1. {"Nucleus & nucleons" if lang=="en" else "Noyau et nucléons"}, 2. {"Electrons" if lang=="en" else "Électrons"}, 3. {"Atomic mass" if lang=="en" else "Masse de l'atome"})<br>
                                <strong>II. {"Chemical Element" if lang=="en" else "L'Élément Chimique"}</strong> (1. {"Atomic number Z" if lang=="en" else "Numéro atomique Z"}, 2. {"Isotopes" if lang=="en" else "Isotopes"}, 3. {"Monatomic ions" if lang=="en" else "Ions monoatomiques"})<br>
                                <strong>III. {"Electron Distribution" if lang=="en" else "Cortège Électronique"}</strong> (1. {"Shells K, L, M" if lang=="en" else "Couches K, L, M"}, 2. {"Electronic configuration" if lang=="en" else "Formule électronique"})
                            </td>
                            <td>
                                <ul>
                                    <li>{"Textbook, whiteboard, atomic simulations" if lang=="en" else "Manuel, tableau, animations 3D de l'atome"}</li>
                                    <li>{"Posters of Rutherford and Bohr models" if lang=="en" else "Posters historiques des modèles atomiques"}</li>
                                    <li>{"Chemical reagents: copper turnings, nitric acid (conservation of Cu)" if lang=="en" else "Tournure de cuivre, acide nitrique (conservation de l'élément)"}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>{"Activities:" if lang=="en" else "Activités :"}</strong> {"Demonstrate conservation of copper element through cycle of reactions. Write electron configurations for elements Z = 1 to 18." if lang=="en" else "Mise en évidence de la conservation du cuivre. Écriture des formules électroniques pour Z = 1 à 18."}<br>
                                <strong>{"Evaluation:" if lang=="en" else "Évaluation :"}</strong> {"Isotope counting and electronic configuration quizzes." if lang=="en" else "Exercices de structure électronique et Devoir surveillé 2."}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- UNIT 5 -->
            <div class="unit-block">
                <div class="unit-banner">
                    <span>{"Unit 5: Molecular Geometry" if lang=="en" else "Unité 5 : Géométrie de Quelques Molécules"}</span>
                    <span>2 {"Hours" if lang=="en" else "Heures"}</span>
                </div>
                <div class="unit-prereq-problem">
                    <div class="prereq-col">
                        <div class="block-title">{"Prerequisites:" if lang=="en" else "Prérequis :"}</div>
                        {"Electronic structure, valence electrons, ions." if lang=="en" else "Structure électronique, électrons de valence, ions."}
                    </div>
                    <div class="problem-col">
                        <div class="block-title">{"Problem Situation:" if lang=="en" else "Situation-Problème :"}</div>
                        {"Atoms bind together to form molecules with specific 3D geometries. What rules govern chemical bonding, and how do we draw Lewis and Cram representations?" if lang=="en" else "Les atomes s'unissent pour former des molécules à géométrie spatiale définie. Quelles règles régissent les liaisons covalentes ?"}
                    </div>
                </div>
                <table class="pedagogical-table">
                    <thead><tr><th style="width:25%;">{"Objectives" if lang=="en" else "Objectifs"}</th><th style="width:25%;">{"Contents" if lang=="en" else "Contenus"}</th><th style="width:25%;">{"Didactic Materials" if lang=="en" else "Matériel Didactique"}</th><th style="width:25%;">{"Activities & Evaluation" if lang=="en" else "Activités & Évaluation"}</th></tr></thead>
                    <tbody>
                        <tr>
                            <td>
                                <ul>
                                    <li>{"Duet (2) and Octet (8) stability rules." if lang=="en" else "Règles de stabilité du duet et de l'octet."}</li>
                                    <li>{"Covalent bonding: bonding and non-bonding electron pairs." if lang=="en" else "Liaison covalente : doublets liants et non liants."}</li>
                                    <li>{"Lewis structures of molecules (H₂O, CH₄, NH₃, CO₂)." if lang=="en" else "Représentation de Lewis des molécules."}</li>
                                    <li>{"Isomerism: structural isomers." if lang=="en" else "Isomérie de constitution."}</li>
                                    <li>{"3D spatial geometry: Cram notation (tetrahedral, pyramid, bent, linear)." if lang=="en" else "Géométrie spatiale et représentation de Cram."}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>I. {"Duet & Octet Rules" if lang=="en" else "Règles du Duet et de l'Octet"}</strong> (1. {"Inert gas configurations" if lang=="en" else "Gaz nobles"}, 2. {"Monatomic ions stability" if lang=="en" else "Stabilité des ions monoatomiques"})<br>
                                <strong>II. {"Lewis Model" if lang=="en" else "Modèle de Lewis"}</strong> (1. {"Covalent bond" if lang=="en" else "Liaison covalente"}, 2. {"Lewis representation" if lang=="en" else "Formules de Lewis"}, 3. {"Isomers" if lang=="en" else "Isomères"})<br>
                                <strong>III. {"Molecular Geometry" if lang=="en" else "Géométrie Moléculaire"}</strong> (1. {"Electron pair repulsion" if lang=="en" else "Répulsion des doublets"}, 2. {"Cram 3D representation" if lang=="en" else "Représentation de Cram"})
                            </td>
                            <td>
                                <ul>
                                    <li>{"Molecular model kits (plastic balls and connectors)" if lang=="en" else "Boîtes de modèles moléculaires boules et tiges"}</li>
                                    <li>{"Computer software for 3D molecular visualization (ChemSketch)" if lang=="en" else "Logiciel de visualisation moléculaire 3D"}</li>
                                    <li>{"Whiteboard and colored markers" if lang=="en" else "Tableau et marqueurs couleur"}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>{"Activities:" if lang=="en" else "Activités :"}</strong> {"Build physical models of methane CH₄, ammonia NH₃, and water H₂O; deduce valence bond angles and draw Cram formulas." if lang=="en" else "Construction des modèles de CH₄, NH₃, H₂O et dessin en représentation de Cram."}<br>
                                <strong>{"Evaluation:" if lang=="en" else "Évaluation :"}</strong> {"Lewis diagram worksheets and isomer identification tests." if lang=="en" else "Exercices de schéma de Lewis et Devoir surveillé 3."}
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

    # ---------------- PAGE 12: CHEMISTRY UNITS 6 & 7 ----------------
    p12 = f"""
    <div class="page">
        <div>
            {render_official_header("Common Core" if lang=="en" else "Tronc Commun", "Chemistry Component" if lang=="en" else "Composante Chimie", 11, lang)}
            <div class="overview-box">
                <div class="overview-title">{"Semester 2: Chemistry • Transformations of Matter (Total: 22 Hours)" if lang=="en" else "Semestre 2 : Chimie • Axe 3 : Les Transformations de la Matière (22 Heures)"}</div>
            </div>

            <!-- UNIT 6 -->
            <div class="unit-block">
                <div class="unit-banner">
                    <span>{"Unit 6: Periodic Classification of Elements" if lang=="en" else "Unité 6 : La Classification Périodique des Éléments"}</span>
                    <span>4 {"Hours" if lang=="en" else "Heures"}</span>
                </div>
                <div class="unit-prereq-problem">
                    <div class="prereq-col">
                        <div class="block-title">{"Prerequisites:" if lang=="en" else "Prérequis :"}</div>
                        {"Atomic number Z, electronic configuration (K, L, M), valence electrons." if lang=="en" else "Numéro atomique Z, structure électronique K, L, M, valence."}
                    </div>
                    <div class="problem-col">
                        <div class="block-title">{"Problem Situation:" if lang=="en" else "Situation-Problème :"}</div>
                        {"Mendeleev organized elements into a periodic table in 1869. What criteria govern modern periodic classification, and what properties do elements in the same column share?" if lang=="en" else "Mendeleïev a classé les éléments en 1869. Quels critères régissent le tableau actuel et que partagent les éléments d'une même colonne ?"}
                    </div>
                </div>
                <table class="pedagogical-table">
                    <thead><tr><th style="width:25%;">{"Objectives" if lang=="en" else "Objectifs"}</th><th style="width:25%;">{"Contents" if lang=="en" else "Contenus"}</th><th style="width:25%;">{"Didactic Materials" if lang=="en" else "Matériel Didactique"}</th><th style="width:25%;">{"Activities & Evaluation" if lang=="en" else "Activités & Évaluation"}</th></tr></thead>
                    <tbody>
                        <tr>
                            <td>
                                <ul>
                                    <li>{"Understand historical construction (Mendeleev) based on atomic mass." if lang=="en" else "Histoire de la classification de Mendeleïev."}</li>
                                    <li>{"Modern criteria: ordered by increasing atomic number Z." if lang=="en" else "Critères modernes : ordre croissant de Z."}</li>
                                    <li>{"Rows (periods): same number of occupied shells." if lang=="en" else "Périodes (lignes) : même nombre de couches."}</li>
                                    <li>{"Columns (chemical families): same valence electrons." if lang=="en" else "Familles (colonnes) : même nombre d'électrons externes."}</li>
                                    <li>{"Identify alkali metals, alkaline earths, halogens, and noble gases." if lang=="en" else "Alcalins, halogènes et gaz nobles."}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>I. {"Mendeleev's Classification" if lang=="en" else "Tableau de Mendeleïev"}</strong> (1. {"Historical context" if lang=="en" else "Contexte historique"}, 2. {"Predicted elements" if lang=="en" else "Éléments prédits"})<br>
                                <strong>II. {"Modern Periodic Table" if lang=="en" else "Tableau Périodique Actuel"}</strong> (1. {"Periods & columns" if lang=="en" else "Périodes et colonnes"}, 2. {"Electronic configuration relationship" if lang=="en" else "Lien avec la formule électronique"})<br>
                                <strong>III. {"Chemical Families" if lang=="en" else "Familles Chimiques"}</strong> (1. {"Alkali metals (Col 1)" if lang=="en" else "Alcalins (Col 1)"}, 2. {"Halogens (Col 17)" if lang=="en" else "Halogènes (Col 17)"}, 3. {"Noble gases (Col 18)" if lang=="en" else "Gaz nobles (Col 18)"})
                            </td>
                            <td>
                                <ul>
                                    <li>{"Large wall periodic table of chemical elements" if lang=="en" else "Tableau périodique mural grand format"}</li>
                                    <li>{"Solutions: NaCl, NaBr, NaI, AgNO₃ (precipitation of halides)" if lang=="en" else "Solutions : NaCl, NaBr, NaI, AgNO₃ (tests des halogénures)"}</li>
                                    <li>{"Chlorine water, bromine water, iodine solution" if lang=="en" else "Eau de chlore, eau de brome, eau iodée"}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>{"Activities:" if lang=="en" else "Activités :"}</strong> {"Test similarities between halogens Cl⁻, Br⁻, I⁻ using silver nitrate. Locate elements in the table from their electron formula." if lang=="en" else "Tests comparatifs des halogénures avec le nitrate d'argent. Détermination de la position d'un élément d'après sa formule électronique."}<br>
                                <strong>{"Evaluation:" if lang=="en" else "Évaluation :"}</strong> {"Periodic table mapping exercises and family identification." if lang=="en" else "Exercices de repérage dans le tableau et Devoir 3."}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- UNIT 7 -->
            <div class="unit-block">
                <div class="unit-banner">
                    <span>{"Unit 7: Tools for Describing a Chemical System (The Mole)" if lang=="en" else "Unité 7 : Outils de Description d'un Système Chimique (La Mole)"}</span>
                    <span>4 {"Hours" if lang=="en" else "Heures"}</span>
                </div>
                <div class="unit-prereq-problem">
                    <div class="prereq-col">
                        <div class="block-title">{"Prerequisites:" if lang=="en" else "Prérequis :"}</div>
                        {"Mass, volume, atoms, molecules, density." if lang=="en" else "Masse, volume, atomes, molécules, masse volumique."}
                    </div>
                    <div class="problem-col">
                        <div class="block-title">{"Problem Situation:" if lang=="en" else "Situation-Problème :"}</div>
                        {"A single drop of water contains 10²¹ molecules. How do chemists count such astronomical numbers of particles, and what is the mole?" if lang=="en" else "Une goutte d'eau contient 10²¹ molécules. Comment les chimistes dénombrent-ils ces particules microscopiques ? Qu'est-ce que la mole ?"}
                    </div>
                </div>
                <table class="pedagogical-table">
                    <thead><tr><th style="width:25%;">{"Objectives" if lang=="en" else "Objectifs"}</th><th style="width:25%;">{"Contents" if lang=="en" else "Contenus"}</th><th style="width:25%;">{"Didactic Materials" if lang=="en" else "Matériel Didactique"}</th><th style="width:25%;">{"Activities & Evaluation" if lang=="en" else "Activités & Évaluation"}</th></tr></thead>
                    <tbody>
                        <tr>
                            <td>
                                <ul>
                                    <li>{"Define the mole and Avogadro constant: N_A = 6.022 × 10²³ mol⁻¹." if lang=="en" else "Définir la mole et la constante d'Avogadro N_A."}</li>
                                    <li>{"Molar mass M: atomic, molecular, and ionic (g/mol)." if lang=="en" else "Masse molaire atomique et moléculaire M (g/mol)."}</li>
                                    <li>{"Relation n = m / M and n = (ρ · V) / M." if lang=="en" else "Relations n = m / M et n = (ρ·V) / M."}</li>
                                    <li>{"Molar volume of gas V_m (L/mol) and n = V / V_m." if lang=="en" else "Volume molaire des gaz V_m et relation n = V / V_m."}</li>
                                    <li>{"Ideal gas equation of state: P · V = n · R · T." if lang=="en" else "Équation d'état des gaz parfaits : P·V = n·R·T."}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>I. {"Quantity of Matter" if lang=="en" else "Quantité de Matière"}</strong> (1. {"The mole unit" if lang=="en" else "La mole"}, 2. {"Avogadro constant N_A" if lang=="en" else "Constante d'Avogadro"}, 3. {"Formula n = N / N_A" if lang=="en" else "Relation n = N / N_A"})<br>
                                <strong>II. {"Molar Mass" if lang=="en" else "Masse Molaire"}</strong> (1. {"Atomic molar mass" if lang=="en" else "Masse molaire atomique"}, 2. {"Molecular molar mass" if lang=="en" else "Masse molaire moléculaire"}, 3. {"Relation n = m / M" if lang=="en" else "Relation n = m / M"})<br>
                                <strong>III. {"Gases & Ideal Gas Law" if lang=="en" else "Cas des Gaz"}</strong> (1. {"Molar volume V_m" if lang=="en" else "Volume molaire V_m"}, 2. {"Avogadro-Ampere hypothesis" if lang=="en" else "Loi d'Avogadro-Ampère"}, 3. {"Ideal gas law P·V = n·R·T" if lang=="en" else "Loi P·V = n·R·T"})
                            </td>
                            <td>
                                <ul>
                                    <li>{"Precision digital balance, iron nails, sulfur, table salt, glucose" if lang=="en" else "Balance électronique, clous en fer, soufre, sel, glucose"}</li>
                                    <li>{"Graduated syringes with pressure gauges, gas canisters" if lang=="en" else "Seringues graduées avec manomètre, récipients de gaz"}</li>
                                    <li>{"Graduated cylinders, beakers, periodic table" if lang=="en" else "Éprouvettes graduées, béchers, tableau périodique"}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>{"Activities:" if lang=="en" else "Activités :"}</strong> {"Weigh 1 mole of iron and 1 mole of water. Measure gas volume injected into syringe to verify P·V = n·R·T." if lang=="en" else "Pesée d'une mole de diverses substances. Mesure du volume d'un gaz et vérification de la loi des gaz parfaits."}<br>
                                <strong>{"Evaluation:" if lang=="en" else "Évaluation :"}</strong> {"Calculations of moles from mass, volume, and pressure; Exam 4." if lang=="en" else "Calculs de n à partir de m et V ; Devoir surveillé 4."}
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

    # ---------------- PAGE 13: CHEMISTRY UNITS 8 & 9 ----------------
    p13 = f"""
    <div class="page">
        <div>
            {render_official_header("Common Core" if lang=="en" else "Tronc Commun", "Chemistry Component" if lang=="en" else "Composante Chimie", 12, lang)}
            <div class="overview-box">
                <div class="overview-title">{"Semester 2: Chemistry • Module 3: Solutions and Chemical Reactions (12 Hours)" if lang=="en" else "Semestre 2 : Chimie • Axe 3 : Solutions et Réactions Chimiques (12 Heures)"}</div>
            </div>

            <!-- UNIT 8 -->
            <div class="unit-block">
                <div class="unit-banner">
                    <span>{"Unit 8: Molar Concentration" if lang=="en" else "Unité 8 : La Concentration Molaire"}</span>
                    <span>4 {"Hours" if lang=="en" else "Heures"}</span>
                </div>
                <div class="unit-prereq-problem">
                    <div class="prereq-col">
                        <div class="block-title">{"Prerequisites:" if lang=="en" else "Prérequis :"}</div>
                        {"The mole, molar mass, dissolution, mass concentration." if lang=="en" else "La mole, masse molaire, dissolution, concentration massique."}
                    </div>
                    <div class="problem-col">
                        <div class="block-title">{"Problem Situation:" if lang=="en" else "Situation-Problème :"}</div>
                        {"Seawater and saline drips have precise salt concentrations. How do chemists prepare solutions of exact concentration by dissolution and dilution?" if lang=="en" else "L'eau de mer et le sérum physiologique ont des teneurs précises en sel. Comment prépare-t-on une solution par dissolution et par dilution ?"}
                    </div>
                </div>
                <table class="pedagogical-table">
                    <thead><tr><th style="width:25%;">{"Objectives" if lang=="en" else "Objectifs"}</th><th style="width:25%;">{"Contents" if lang=="en" else "Contenus"}</th><th style="width:25%;">{"Didactic Materials" if lang=="en" else "Matériel Didactique"}</th><th style="width:25%;">{"Activities & Evaluation" if lang=="en" else "Activités & Évaluation"}</th></tr></thead>
                    <tbody>
                        <tr>
                            <td>
                                <ul>
                                    <li>{"Define molar concentration of solute: C = n / V (mol/L)." if lang=="en" else "Concentration molaire du soluté : C = n / V (mol/L)."}</li>
                                    <li>{"Relation with mass concentration: C_m = C · M." if lang=="en" else "Relation avec la concentration massique : C_m = C·M."}</li>
                                    <li>{"Protocol for preparing a solution by dissolution (m = C·V·M)." if lang=="en" else "Protocole de préparation par dissolution."}</li>
                                    <li>{"Protocol for dilution: conservation of matter C_i·V_i = C_f·V_f." if lang=="en" else "Protocole de dilution : conservation C_i·V_i = C_f·V_f."}</li>
                                    <li>{"Dilution factor: F = C_i / C_f = V_f / V_i." if lang=="en" else "Facteur de dilution : F = C_i / C_f = V_f / V_i."}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>I. {"Molar Concentration" if lang=="en" else "Concentration Molaire"}</strong> (1. {"Definition" if lang=="en" else "Définition"}, 2. {"Mass vs molar concentration" if lang=="en" else "Concentrations massique et molaire"})<br>
                                <strong>II. {"Preparation by Dissolution" if lang=="en" else "Préparation par Dissolution"}</strong> (1. {"Mass calculation" if lang=="en" else "Calcul de la masse"}, 2. {"Experimental glassware protocol" if lang=="en" else "Protocole expérimental"})<br>
                                <strong>III. {"Dilution of Solutions" if lang=="en" else "Dilution d'une Solution"}</strong> (1. {"Conservation of quantity of matter" if lang=="en" else "Conservation de matière"}, 2. {"Dilution factor F" if lang=="en" else "Facteur de dilution F"}, 3. {"Glassware handling" if lang=="en" else "Protocole opératoire"})
                            </td>
                            <td>
                                <ul>
                                    <li>{"Volumetric flasks (50, 100, 250 mL), volumetric pipettes (5, 10 mL)" if lang=="en" else "Fioles jaugées, pipettes jaugées, propipettes"}</li>
                                    <li>{"Electronic balance, weighing boat, spatula, wash bottle" if lang=="en" else "Balance électronique, coupelle, spatule, pissette"}</li>
                                    <li>{"Potassium permanganate KMnO₄, copper sulfate CuSO₄" if lang=="en" else "Permanganate de potassium, sulfate de cuivre"}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>{"Activities:" if lang=="en" else "Activités :"}</strong> {"Calculate mass m = C·V·M, weigh solute, dissolve in volumetric flask, and dilute stock solution by factor F = 10." if lang=="en" else "Calcul de masse, pesée, dissolution en fiole jaugée et dilution d'une solution mère au 1/10ème."}<br>
                                <strong>{"Evaluation:" if lang=="en" else "Évaluation :"}</strong> {"Dissolution and dilution exercises, glassware identification tests." if lang=="en" else "Exercices de dilution et Devoir surveillé 5."}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- UNIT 9 -->
            <div class="unit-block">
                <div class="unit-banner">
                    <span>{"Unit 9: Chemical Transformations and Matter Balance" if lang=="en" else "Unité 9 : Les Transformations Chimiques - Bilan de Matière"}</span>
                    <span>8 {"Hours" if lang=="en" else "Heures"}</span>
                </div>
                <div class="unit-prereq-problem">
                    <div class="prereq-col">
                        <div class="block-title">{"Prerequisites:" if lang=="en" else "Prérequis :"}</div>
                        {"Chemical reaction, balancing equations, the mole, molar concentration." if lang=="en" else "Réaction chimique, équilibrage d'équations, la mole, concentration."}
                    </div>
                    <div class="problem-col">
                        <div class="block-title">{"Problem Situation:" if lang=="en" else "Situation-Problème :"}</div>
                        {"During combustion, reactants disappear while new products form. How do we track the exact quantity of each species and determine which reactant runs out first?" if lang=="en" else "Lors d'une combustion, des réactifs disparaissent et des produits apparaissent. Comment quantifier précisément chaque espèce et trouver le réactif limitant ?"}
                    </div>
                </div>
                <table class="pedagogical-table">
                    <thead><tr><th style="width:25%;">{"Objectives" if lang=="en" else "Objectifs"}</th><th style="width:25%;">{"Contents" if lang=="en" else "Contenus"}</th><th style="width:25%;">{"Didactic Materials" if lang=="en" else "Matériel Didactique"}</th><th style="width:25%;">{"Activities & Evaluation" if lang=="en" else "Activités & Évaluation"}</th></tr></thead>
                    <tbody>
                        <tr>
                            <td>
                                <ul>
                                    <li>{"Model a chemical transformation with a balanced equation." if lang=="en" else "Modéliser la transformation par une équation équilibrée."}</li>
                                    <li>{"Define reaction progress x (in mol)." if lang=="en" else "Définir l'avancement de réaction x (en mol)."}</li>
                                    <li>{"Construct an ICE reaction progress table." if lang=="en" else "Dresser le tableau d'avancement (Initial, En cours, Final)."}</li>
                                    <li>{"Identify limiting reactant and maximum progress x_max." if lang=="en" else "Identifier le réactif limitant et l'avancement maximal x_max."}</li>
                                    <li>{"Establish matter balance in final state." if lang=="en" else "Dresser le bilan de matière à l'état final."}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>I. {"Chemical Transformation" if lang=="en" else "Transformation Chimique"}</strong> (1. {"Initial and final state" if lang=="en" else "État initial et état final"}, 2. {"Reaction equation" if lang=="en" else "Équation de réaction"})<br>
                                <strong>II. {"Progress of Reaction" if lang=="en" else "Avancement de la Réaction"}</strong> (1. {"Definition of progress x" if lang=="en" else "Notion d'avancement x"}, 2. {"ICE progress table" if lang=="en" else "Tableau d'avancement"})<br>
                                <strong>III. {"Matter Balance & Limiting Reactant" if lang=="en" else "Bilan de Matière & Réactif Limitant"}</strong> (1. {"Hypotheses for x_max" if lang=="en" else "Hypothèses pour x_max"}, 2. {"Limiting reactant determination" if lang=="en" else "Détermination du réactif limitant"}, 3. {"Final composition" if lang=="en" else "Composition finale"})
                            </td>
                            <td>
                                <ul>
                                    <li>{"Reaction of magnesium ribbon with hydrochloric acid" if lang=="en" else "Réaction du ruban de magnésium avec l'acide chlorhydrique"}</li>
                                    <li>{"Gas collection apparatus over water with graduated test tube" if lang=="en" else "Dispositif de recueil de gaz sur cuve à eau"}</li>
                                    <li>{"Precipitation reaction: copper sulfate + sodium hydroxide" if lang=="en" else "Précipitation : sulfate de cuivre + soude"}</li>
                                </ul>
                            </td>
                            <td>
                                <strong>{"Activities:" if lang=="en" else "Activités :"}</strong> {"React varied masses of Mg with fixed HCl volume; measure H₂ gas produced; verify that x_max matches theoretical limiting reactant calculation." if lang=="en" else "Réaction de Mg avec HCl ; mesure du volume de H₂ dégagé ; confrontation avec le calcul théorique de x_max."}<br>
                                <strong>{"Evaluation:" if lang=="en" else "Évaluation :"}</strong> {"Full ICE table problem solving and end-of-year Supervised Exam 6." if lang=="en" else "Résolution complète de bilans de matière et Devoir surveillé 6."}
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

    return f"""<!DOCTYPE html>
<html lang="{lang}">
<head>
<meta charset="UTF-8">
<title>Moroccan Common Core Science & Technology Curriculum Lesson Plans - Professor AYOUB KHAMMOUR</title>
<style>{CSS_PAGE_STYLE}</style>
</head>
<body>
{"".join(pages_html)}
</body>
</html>"""

def main():
    out_dir = "/home/ubuntu/projects/codshop/pdf_translations"
    os.makedirs(out_dir, exist_ok=True)

    en_html = os.path.join(out_dir, "TC_Physics_Chemistry_Lesson_Plans_English.html")
    en_pdf = os.path.join(out_dir, "TC_Physics_Chemistry_Lesson_Plans_English.pdf")
    fr_html = os.path.join(out_dir, "TC_Physique_Chimie_Fiches_Pedagogiques_Francais.html")
    fr_pdf = os.path.join(out_dir, "TC_Physique_Chimie_Fiches_Pedagogiques_Francais.pdf")

    print("Writing TC English HTML...")
    with open(en_html, "w", encoding="utf-8") as f:
        f.write(build_tc_html("en"))

    print("Writing TC French HTML...")
    with open(fr_html, "w", encoding="utf-8") as f:
        f.write(build_tc_html("fr"))

    print("Compiling TC English PDF...")
    subprocess.run(["/snap/bin/chromium", "--headless=new", "--disable-gpu", "--no-sandbox", f"--print-to-pdf={en_pdf}", f"file://{en_html}"], check=True)

    print("Compiling TC French PDF...")
    subprocess.run(["/snap/bin/chromium", "--headless=new", "--disable-gpu", "--no-sandbox", f"--print-to-pdf={fr_pdf}", f"file://{fr_html}"], check=True)

    print(f"TC English PDF: {os.path.getsize(en_pdf)} bytes")
    print(f"TC French PDF: {os.path.getsize(fr_pdf)} bytes")

if __name__ == "__main__":
    main()
