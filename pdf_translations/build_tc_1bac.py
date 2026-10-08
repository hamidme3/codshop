# -*- coding: utf-8 -*-
"""
Generator for English and French translations of Moroccan Curriculum Lesson Plans
- Common Core Sciences & Technology (TC)
- 1st Year Baccalaureate Sciences (1BAC)
Author: Professor AYOUB KHAMMOUR
"""

import os
import subprocess

CSS_STYLE = """
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

@page {
    size: A4;
    margin: 12mm 15mm 15mm 15mm;
    @bottom-center {
        content: counter(page);
    }
}

* {
    box-sizing: border-box;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
}

body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: #1e293b;
    background-color: #ffffff;
    line-height: 1.5;
    font-size: 11pt;
    margin: 0;
    padding: 0;
}

.cover-page {
    page-break-after: always;
    height: 92vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    border: 3px double #0284c7;
    border-radius: 12px;
    padding: 40px;
    background: linear-gradient(135deg, #f8fafc 0%, #f0f9ff 100%);
}

.cover-title {
    font-size: 28pt;
    font-weight: 800;
    color: #0369a1;
    margin-bottom: 12px;
    letter-spacing: -0.5px;
}

.cover-subtitle {
    font-size: 18pt;
    font-weight: 600;
    color: #0f172a;
    margin-bottom: 24px;
}

.cover-badge {
    display: inline-block;
    background: #0284c7;
    color: white;
    padding: 8px 24px;
    border-radius: 9999px;
    font-size: 13pt;
    font-weight: 600;
    margin-bottom: 40px;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.cover-author {
    font-size: 14pt;
    font-weight: 500;
    color: #334155;
    margin-top: 30px;
    padding-top: 20px;
    border-top: 1px solid #cbd5e1;
    width: 60%;
}

.cover-meta {
    margin-top: 25px;
    font-size: 11pt;
    color: #64748b;
}

.unit-container {
    page-break-after: always;
    margin-bottom: 20px;
}

.unit-header-box {
    background: #f1f5f9;
    border-left: 5px solid #0284c7;
    padding: 12px 16px;
    border-radius: 0 8px 8px 0;
    margin-bottom: 16px;
}

.unit-part-tag {
    font-size: 9pt;
    font-weight: 700;
    color: #0369a1;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.unit-title {
    font-size: 16pt;
    font-weight: 700;
    color: #0f172a;
    margin: 4px 0 6px 0;
}

.unit-meta-bar {
    display: flex;
    gap: 20px;
    font-size: 9.5pt;
    color: #475569;
    font-weight: 500;
}

.grid-two-col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 12px;
}

.info-card {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 10px 14px;
}

.info-card.accent {
    background: #f8fafc;
    border-left: 3px solid #3b82f6;
}

.info-card h4 {
    margin: 0 0 6px 0;
    font-size: 10.5pt;
    font-weight: 700;
    color: #1e293b;
}

.info-card p, .info-card ul {
    margin: 0;
    font-size: 9pt;
    color: #334155;
}

.info-card ul {
    padding-left: 18px;
}

.info-card li {
    margin-bottom: 4px;
}

.table-sheet {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
    font-size: 8.5pt;
}

.table-sheet th {
    background: #0f172a;
    color: #ffffff;
    font-weight: 600;
    padding: 8px 10px;
    border: 1px solid #cbd5e1;
    text-align: left;
    font-size: 9pt;
}

.table-sheet td {
    border: 1px solid #cbd5e1;
    padding: 8px 10px;
    vertical-align: top;
    color: #1e293b;
}

.table-sheet tr:nth-child(even) td {
    background: #f8fafc;
}

.table-sheet ul {
    margin: 0;
    padding-left: 15px;
}

.table-sheet li {
    margin-bottom: 3px;
}
"""

def get_tc_english_html():
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Common Core Sciences - Physics & Chemistry Lesson Plans</title>
<style>{CSS_STYLE}</style>
</head>
<body>

<div class="cover-page">
    <div class="cover-badge">Kingdom of Morocco • Secondary Education</div>
    <div class="cover-title">Pedagogical Lesson Plans</div>
    <div class="cover-subtitle">Physics & Chemistry (Common Core of Science & Technology)</div>
    <div style="font-size: 12pt; color: #475569; max-width: 500px; margin: 0 auto 30px auto;">
        Official Curriculum • Common Core Scientific and Technical Streams (TCS & TCT)
    </div>
    <div class="cover-author">
        <strong>Prepared by:</strong> Professor AYOUB KHAMMOUR<br>
        <span style="font-size: 10.5pt; color: #64748b;">Registration No: 1503811</span>
    </div>
    <div class="cover-meta">
        Official Reference: National Educational Orientations • Ministerial Memos 09-142 & 144 • Approved Textbooks
    </div>
</div>

<!-- ================= TC MECHANICS ================= -->

<div class="unit-container">
    <div class="unit-header-box">
        <div class="unit-part-tag">Physics Component • Semester 1 • Mechanics (Total: 28 Hours)</div>
        <div class="unit-title">Module 1: Fundamental Interactions • Unit 1: Universal Gravitation & Unit 2: Mechanical Actions</div>
        <div class="unit-meta-bar">
            <span><strong>Duration:</strong> 6 Hours (4h + 2h)</span>
            <span><strong>Streams:</strong> Common Core Science & Technology</span>
        </div>
    </div>

    <div class="grid-two-col">
        <div class="info-card">
            <h4>📋 Prerequisites</h4>
            <ul>
                <li>Mechanical interactions and effects of forces.</li>
                <li>Contact forces vs action-at-a-distance forces.</li>
                <li>Distinction between mass m (in kg) and weight P (in N).</li>
                <li>Principle of reciprocal interactions (Newton's 3rd Law).</li>
            </ul>
        </div>
        <div class="info-card accent">
            <h4>❓ Guiding Problem Situation</h4>
            <p>The solar system maintains planets in orbit across billions of kilometers. What governs planetary coherence? What is the relationship between universal gravitation and body weight on Earth? How does dam water exert pressure on a concrete wall?</p>
        </div>
    </div>

    <div class="info-card" style="margin-bottom: 12px;">
        <h4>🎯 Targeted Competencies & Learning Objectives</h4>
        <ul>
            <li>Understand distance scales from microscopic (atoms) to astronomical (galaxies) and determine orders of magnitude.</li>
            <li>Master Newton's Universal Gravitation Law: F = G · (m_A · m_B) / d² and represent gravitational interaction vectors with an appropriate scale.</li>
            <li>Formulate weight P = m · g, understand gravity variation with altitude h: g(h) = g₀ · R_T² / (R_T + h)², and distinguish mass from weight.</li>
            <li>Classify mechanical forces: contact (localized vs distributed) and action-at-a-distance; internal vs external forces.</li>
            <li>Define pressing force F and fluid pressure P = F / S; utilize Pascal (Pa) and bar units.</li>
        </ul>
    </div>

    <table class="table-sheet">
        <thead>
            <tr>
                <th style="width: 28%;">Course Outline</th>
                <th style="width: 24%;">Didactic Aids & Equipment</th>
                <th style="width: 26%;">Learning Activities</th>
                <th style="width: 22%;">Assessment Strategy</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>
                    <strong>I. Universal Gravitation</strong>
                    <ul>
                        <li>1. Scale of distances & order of magnitude (powers of 10)</li>
                        <li>2. Newton's gravitational law: F_A/B = F_B/A = G(m_A m_B)/d²</li>
                        <li>3. Terrestrial gravity field g and body weight P = m·g</li>
                        <li>4. Variation of g with altitude & latitude</li>
                    </ul>
                    <strong>II. Examples of Mechanical Actions</strong>
                    <ul>
                        <li>1. Mechanical actions: static vs dynamic effect</li>
                        <li>2. Vector representation of force (point of application, line of action, direction, magnitude)</li>
                        <li>3. Classification: contact vs remote, internal vs external</li>
                        <li>4. Pressing force & pressure formula P = F / S</li>
                    </ul>
                </td>
                <td>
                    <ul>
                        <li>Student textbook & whiteboard</li>
                        <li>Video clips & astronomical simulation media</li>
                        <li>Dynamometers & spring balances</li>
                        <li>Weights & calibrated slotted masses</li>
                        <li>Air pump, vacuum jar & balloons</li>
                        <li>Wooden blocks with smooth/rough surfaces</li>
                        <li>Manometer & pressure sensor setup</li>
                    </ul>
                </td>
                <td>
                    <strong>Teacher:</strong>
                    <ul>
                        <li>Guide comparison of gravitational forces between Earth, Moon, and everyday objects.</li>
                        <li>Illustrate pressure variations with depth and surface area.</li>
                        <li>Supervise vector representation of forces.</li>
                    </ul>
                    <strong>Student:</strong>
                    <ul>
                        <li>Calculate gravitational force between planets.</li>
                        <li>Determine order of magnitude of atomic and cosmic distances.</li>
                        <li>Solve pressure problems P = F / S.</li>
                    </ul>
                </td>
                <td>
                    <strong>Diagnostic:</strong>
                    <ul>
                        <li>Review units (N, kg, m/s²) and scientific notation.</li>
                    </ul>
                    <strong>Formative:</strong>
                    <ul>
                        <li>Force vector diagram drawing test.</li>
                    </ul>
                    <strong>Summative:</strong>
                    <ul>
                        <li>Supervised Exam 1 (Gravitation & Pressure).</li>
                    </ul>
                </td>
            </tr>
        </tbody>
    </table>
</div>

<div class="unit-container">
    <div class="unit-header-box">
        <div class="unit-part-tag">Physics Component • Semester 1 • Mechanics</div>
        <div class="unit-title">Module 2 & 3: Motion, Inertia Principle & Equilibrium of Solid Bodies</div>
        <div class="unit-meta-bar">
            <span><strong>Duration:</strong> 22 Hours</span>
            <span><strong>Streams:</strong> Common Core Science & Technology</span>
        </div>
    </div>

    <div class="grid-two-col">
        <div class="info-card">
            <h4>📋 Prerequisites</h4>
            <ul>
                <li>Concepts of motion and rest; speed and trajectory.</li>
                <li>Equilibrium under two forces; spring tension.</li>
                <li>Vectors, trigonometry, and coordinate projections.</li>
            </ul>
        </div>
        <div class="info-card accent">
            <h4>❓ Guiding Problem Situation</h4>
            <p>Bus passengers lurch forward when brakes are applied suddenly. Can motion persist without a force? How do mountaineers achieve equilibrium on sheer rock faces, and why does a wrench make it easier to loosen a car wheel bolt?</p>
        </div>
    </div>

    <div class="info-card" style="margin-bottom: 12px;">
        <h4>🎯 Targeted Competencies & Learning Objectives</h4>
        <ul>
            <li>Understand relativity of motion, reference frames (spatial and temporal), and determine average/instantaneous speed.</li>
            <li>State the Principle of Inertia (Newton's 1st Law) for isolated/semi-isolated systems (ΣF_ext = 0 ⇔ v_G = const).</li>
            <li>Study equilibrium under 2 forces (F₁ + F₂ = 0), apply Hooke's law T = k · |Δl|, Archimedes' principle F_A = ρ_fluid · V · g, and static friction.</li>
            <li>Study equilibrium under 3 non-parallel forces: verify coplanarity and concurrency; resolve using geometric polygon and analytical axis projection.</li>
            <li>State the Theorem of Moments: Σ M_Δ(F) = 0 for rotation around a fixed axis; calculate moment M_Δ(F) = ± F · d and couple of forces.</li>
        </ul>
    </div>

    <table class="table-sheet">
        <thead>
            <tr>
                <th style="width: 28%;">Course Outline</th>
                <th style="width: 24%;">Didactic Aids & Equipment</th>
                <th style="width: 26%;">Learning Activities</th>
                <th style="width: 22%;">Assessment Strategy</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>
                    <strong>I. Kinematics & Principle of Inertia</strong>
                    <ul>
                        <li>1. Trajectory & rectilinear/circular uniform motion</li>
                        <li>2. Center of inertia G & barycentric relation</li>
                        <li>3. Newton's 1st Law (Principle of Inertia)</li>
                    </ul>
                    <strong>II. Equilibrium Under Two Forces</strong>
                    <ul>
                        <li>1. Condition: F₁ + F₂ = 0</li>
                        <li>2. Spring elongation: T = k·(l - l₀)</li>
                        <li>3. Archimedes' thrust & solid floating condition</li>
                        <li>4. Friction on inclined plane & friction angle φ</li>
                    </ul>
                    <strong>III. Equilibrium Under Three Forces</strong>
                    <ul>
                        <li>1. Concurrency and coplanarity conditions</li>
                        <li>2. Geometric vector triangle & Cartesian projection</li>
                    </ul>
                    <strong>IV. Rotation Around Fixed Axis</strong>
                    <ul>
                        <li>1. Moment of force: M_Δ(F) = ± F·d</li>
                        <li>2. Theorem of moments: Σ M_Δ(F) = 0</li>
                        <li>3. Couple of forces and torsion wire couple M_c = -C·θ</li>
                    </ul>
                </td>
                <td>
                    <ul>
                        <li>Air cushion table with spark recording pucks</li>
                        <li>Avimeca motion analysis software & webcam</li>
                        <li>Graduated springs (known stiffness k) & stands</li>
                        <li>Dynamometers & circular protractor boards</li>
                        <li>Equilibrium disc mounted on low-friction bearing</li>
                        <li>Torsion wire apparatus with needle pointer</li>
                        <li>Immersion vessels, liquids of different densities (water, oil)</li>
                    </ul>
                </td>
                <td>
                    <strong>Teacher:</strong>
                    <ul>
                        <li>Demonstrate frictionless puck trajectory and center of mass motion.</li>
                        <li>Supervise experimental verification of the vector polygon for 3 forces.</li>
                        <li>Demonstrate moment equilibrium with perforated metal ruler.</li>
                    </ul>
                    <strong>Student:</strong>
                    <ul>
                        <li>Plot spring tension T vs elongation Δl and deduce spring constant k.</li>
                        <li>Project force vectors onto orthogonal axes (Ox, Oy).</li>
                        <li>Calculate moments of forces and verify Varignon's theorem.</li>
                    </ul>
                </td>
                <td>
                    <strong>Diagnostic:</strong>
                    <ul>
                        <li>Trigonometry and vector components review test.</li>
                    </ul>
                    <strong>Formative:</strong>
                    <ul>
                        <li>Step-by-step resolution of 3-force equilibrium exercises.</li>
                    </ul>
                    <strong>Summative:</strong>
                    <ul>
                        <li>Midterm exam on solid mechanics and statics.</li>
                    </ul>
                </td>
            </tr>
        </tbody>
    </table>
</div>

<!-- ================= TC ELECTRICITY ================= -->

<div class="unit-container">
    <div class="unit-header-box">
        <div class="unit-part-tag">Physics Component • Semester 2 • Electricity (Total: 32 Hours)</div>
        <div class="unit-title">Current, Voltage, Resistors, Active & Passive Dipoles, and Transistors</div>
        <div class="unit-meta-bar">
            <span><strong>Duration:</strong> 32 Hours</span>
            <span><strong>Streams:</strong> Common Core Science & Technology</span>
        </div>
    </div>

    <div class="grid-two-col">
        <div class="info-card">
            <h4>📋 Prerequisites</h4>
            <ul>
                <li>Atomic charges: free electrons in metals and ions in solutions.</li>
                <li>Basic DC circuits: lamps, batteries, switches, series/parallel loops.</li>
                <li>Using multimeters in ammeter and voltmeter modes.</li>
            </ul>
        </div>
        <div class="info-card accent">
            <h4>❓ Guiding Problem Situation</h4>
            <p>From lightning strikes to smartphone motherboards, electrical energy flows through complex active and passive components. How do resistors divide voltage, how do diodes rectify AC signals, and how does a transistor amplify current?</p>
        </div>
    </div>

    <div class="info-card" style="margin-bottom: 12px;">
        <h4>🎯 Targeted Competencies & Learning Objectives</h4>
        <ul>
            <li>Understand electric current I = Q / Δt; apply Kirchhoff's Node Law (Σ I_in = Σ I_out).</li>
            <li>Measure potential difference U_AB = V_A - V_B; apply Loop Rule (addition of voltages); analyze sinusoidal AC signals using oscilloscope (U_max, U_eff = U_max / √2, T, f).</li>
            <li>Master Ohm's Law: U = R · I; calculate equivalent resistance in series (R_eq = Σ R_i) and parallel (1/R_eq = Σ 1/R_i); design voltage dividers.</li>
            <li>Plot and interpret I-V characteristics of passive dipoles: incandescent lamp, junction diode, Zener diode, LED, and thermistors/LDRs.</li>
            <li>Study linear active generators: U_PN = E - r·I and receivers: U_AB = E' + r'·I; determine circuit operating point and apply Pouillet's Law.</li>
            <li>Understand the NPN bipolar transistor: emitter, base, collector; operating modes (blocked, linear amplifier I_C = β·I_B, and saturated switch).</li>
        </ul>
    </div>

    <table class="table-sheet">
        <thead>
            <tr>
                <th style="width: 28%;">Course Outline</th>
                <th style="width: 24%;">Didactic Aids & Equipment</th>
                <th style="width: 26%;">Learning Activities</th>
                <th style="width: 22%;">Assessment Strategy</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>
                    <strong>I. Electric Current & Voltage</strong>
                    <ul>
                        <li>1. Nature of current & electric quantity Q = I·t</li>
                        <li>2. Node Law (series vs parallel)</li>
                        <li>3. Potential difference U & Loop Law</li>
                        <li>4. Sinusoidal alternating voltage: period, frequency & U_eff</li>
                    </ul>
                    <strong>II. Resistor Associations & Voltage Divider</strong>
                    <ul>
                        <li>1. Ohm's Law U = R·I & resistance of conductor R = ρ·l/S</li>
                        <li>2. Series & parallel combinations</li>
                        <li>3. Voltage divider formula: U₂ = E · R₂ / (R₁ + R₂)</li>
                    </ul>
                    <strong>III. Passive & Active Dipoles</strong>
                    <ul>
                        <li>1. Characteristics of semiconductor diodes, LEDs & Zener</li>
                        <li>2. Generator equation U_PN = E - r·I</li>
                        <li>3. Receiver equation U = E' + r'·I</li>
                        <li>4. Operating point & Pouillet's Law: I = (ΣE - ΣE') / (ΣR)</li>
                    </ul>
                    <strong>IV. The Bipolar Transistor</strong>
                    <ul>
                        <li>1. Terminals (B, C, E) & current amplification I_C = β·I_B</li>
                        <li>2. Switching and sensor applications (light/heat detector)</li>
                    </ul>
                </td>
                <td>
                    <ul>
                        <li>Adjustable DC regulated power supply (0 - 30 V)</li>
                        <li>Low frequency signal generator (GBF) & oscilloscope</li>
                        <li>Digital multimeters (voltmeter, ammeter, ohmmeter)</li>
                        <li>Resistor kits, potentiometer / rheostat</li>
                        <li>Silicon diodes, Zener diodes, LEDs, thermistors, LDRs</li>
                        <li>NPN transistors (e.g. 2N2222 / BC547)</li>
                        <li>Breadboard, connecting leads & breadboard jumpers</li>
                    </ul>
                </td>
                <td>
                    <strong>Teacher:</strong>
                    <ul>
                        <li>Demonstrate oscilloscope calibration and reading of U_max and T.</li>
                        <li>Guide recording of voltage-current data points for generators and diodes.</li>
                        <li>Explain transistor current gain and switching action.</li>
                    </ul>
                    <strong>Student:</strong>
                    <ul>
                        <li>Wire series and parallel circuits; verify Node and Mesh laws.</li>
                        <li>Plot I-V curves on millimeter paper and determine slopes (1/R, -r).</li>
                        <li>Construct an automatic twilight lighting circuit using an LDR and transistor.</li>
                    </ul>
                </td>
                <td>
                    <strong>Diagnostic:</strong>
                    <ul>
                        <li>Circuit symbols and multimeter settings quiz.</li>
                    </ul>
                    <strong>Formative:</strong>
                    <ul>
                        <li>Calculation of equivalent resistances and Pouillet's law exercises.</li>
                    </ul>
                    <strong>Summative:</strong>
                    <ul>
                        <li>Comprehensive end-of-term electricity examination.</li>
                    </ul>
                </td>
            </tr>
        </tbody>
    </table>
</div>

<!-- ================= TC CHEMISTRY ================= -->

<div class="unit-container">
    <div class="unit-header-box">
        <div class="unit-part-tag">Chemistry Component • Semester 1 & 2 • (Total: 42 Hours)</div>
        <div class="unit-title">Chemistry Around Us, Atomic Structure, Periodic Table & Matter Transformations</div>
        <div class="unit-meta-bar">
            <span><strong>Duration:</strong> 42 Hours</span>
            <span><strong>Streams:</strong> Common Core Science & Technology</span>
        </div>
    </div>

    <div class="grid-two-col">
        <div class="info-card">
            <h4>📋 Prerequisites</h4>
            <ul>
                <li>States of matter (solid, liquid, gas) and physical changes.</li>
                <li>Basic atomic concepts (electrons, nucleus) and chemical reactions.</li>
                <li>Laboratory glassware names and safety rules.</li>
            </ul>
        </div>
        <div class="info-card accent">
            <h4>❓ Guiding Problem Situation</h4>
            <p>From extracting essential oils from lavender to synthesizing vanilla aroma, chemistry connects the microscopic world of atoms to everyday products. What is a mole? How do electrons determine chemical bonding, and how do we balance chemical reactions?</p>
        </div>
    </div>

    <div class="info-card" style="margin-bottom: 12px;">
        <h4>🎯 Targeted Competencies & Learning Objectives</h4>
        <ul>
            <li>Distinguish natural and synthetic chemical species; perform solvent extraction, hydrodistillation, and thin-layer chromatography (TLC).</li>
            <li>Carry out chemical synthesis under reflux (e.g. ester synthesis of linalyl acetate).</li>
            <li>Master atomic structure (^A_Z X, isotopes) and electron configuration in shells (K)², (L)⁸, (M)⁸.</li>
            <li>Apply Duet and Octet rules to construct Lewis formulas and molecular geometry (Cram 3D models).</li>
            <li>Navigate the Periodic Table: atomic number Z, rows (periods), columns (chemical families: alkali metals, halogens, noble gases).</li>
            <li>Define the mole, Avogadro constant N_A = 6.022 × 10²³ mol⁻¹, molar mass M, molar volume V_m, and the ideal gas law P·V = n·R·T.</li>
            <li>Prepare solutions by dissolution (m = C·V·M) and dilution (C_i · V_i = C_f · V_f); construct ICE reaction progress tables.</li>
        </ul>
    </div>

    <table class="table-sheet">
        <thead>
            <tr>
                <th style="width: 28%;">Course Outline</th>
                <th style="width: 24%;">Didactic Aids & Equipment</th>
                <th style="width: 26%;">Learning Activities</th>
                <th style="width: 22%;">Assessment Strategy</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>
                    <strong>I. Chemistry Around Us</strong>
                    <ul>
                        <li>1. Chemical species: identification tests (water, glucose, starch)</li>
                        <li>2. Hydrodistillation of lavender & solvent extraction</li>
                        <li>3. Thin-Layer Chromatography (TLC): frontal ratio R_f</li>
                        <li>4. Synthesis under reflux & product purification</li>
                    </ul>
                    <strong>II. Atomic Structure & Periodic Table</strong>
                    <ul>
                        <li>1. Atom nucleus (protons Z, neutrons N) & electron cloud</li>
                        <li>2. Electronic structure (K, L, M) & valence electrons</li>
                        <li>3. Periodic table structure & chemical families</li>
                        <li>4. Duet/Octet rules, Lewis formulas & Cram 3D notation</li>
                    </ul>
                    <strong>III. Describing Chemical Systems & The Mole</strong>
                    <ul>
                        <li>1. Quantity of matter n = N / N_A = m / M</li>
                        <li>2. Gas quantities: n = V / V_m and P·V = n·R·T</li>
                        <li>3. Molar concentration C = n / V and solution dilution</li>
                    </ul>
                    <strong>IV. Chemical Transformations & Progress Table</strong>
                    <ul>
                        <li>1. Chemical reaction modeling & stoichiometric coefficients</li>
                        <li>2. ICE progress table (Initial, Intermediate, Final)</li>
                        <li>3. Limiting reactant & maximum progress x_max</li>
                    </ul>
                </td>
                <td>
                    <ul>
                        <li>Hydrodistillation setup (heating mantle, round flask, condenser)</li>
                        <li>Separatory funnels, TLC silica plates, capillary tubes, UV lamp</li>
                        <li>Molecular model sets (balls and sticks)</li>
                        <li>Large wall-mounted Mendeleev Periodic Table</li>
                        <li>Precision digital analytical balances (0.001 g)</li>
                        <li>Volumetric flasks (50, 100, 250 mL), pipettes & micropipettes</li>
                        <li>Reagents: CuSO₄, NaOH, Fehling solution, cyclohexane, linalool</li>
                    </ul>
                </td>
                <td>
                    <strong>Teacher:</strong>
                    <ul>
                        <li>Supervise hydrodistillation and enforce chemistry safety regulations.</li>
                        <li>Guide students to build physical molecular models with plastic kits.</li>
                        <li>Demonstrate solution preparation and standard dilution procedures.</li>
                    </ul>
                    <strong>Student:</strong>
                    <ul>
                        <li>Run TLC chromatogram, calculate R_f, and identify chemical species.</li>
                        <li>Write Lewis structures for H₂O, CH₄, NH₃, CO₂ and draw Cram representations.</li>
                        <li>Fill ICE tables and predict leftover reactants and product yields.</li>
                    </ul>
                </td>
                <td>
                    <strong>Diagnostic:</strong>
                    <ul>
                        <li>Basic chemistry knowledge and lab safety rules quiz.</li>
                    </ul>
                    <strong>Formative:</strong>
                    <ul>
                        <li>Mole calculations n = m/M and dilution formula practice.</li>
                    </ul>
                    <strong>Summative:</strong>
                    <ul>
                        <li>Standard Common Core physics-chemistry exams.</li>
                    </ul>
                </td>
            </tr>
        </tbody>
    </table>
</div>

</body>
</html>"""

def get_tc_french_html():
    return f"""<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Tronc Commun Scientifique - Fiches Pédagogiques de Physique-Chimie</title>
<style>{CSS_STYLE}</style>
</head>
<body>

<div class="cover-page">
    <div class="cover-badge">Royaume du Maroc • Enseignement Secondaire Qualifiant</div>
    <div class="cover-title">Fiches Pédagogiques</div>
    <div class="cover-subtitle">Physique - Chimie (Tronc Commun Scientifique et Technologique)</div>
    <div style="font-size: 12pt; color: #475569; max-width: 500px; margin: 0 auto 30px auto;">
        Programme Officiel National • Tronc Commun Scientifique (TCS) et Technologique (TCT)
    </div>
    <div class="cover-author">
        <strong>Conception et Réalisation :</strong> Professeur AYOUB KHAMMOUR<br>
        <span style="font-size: 10.5pt; color: #64748b;">N° SOM : 1503811</span>
    </div>
    <div class="cover-meta">
        Cadre de Référence Officiel : Orientations Pédagogiques • Notes Ministérielles N° 09-142 et 144 • Manuels Scolaires Agréés
    </div>
</div>

<!-- ================= TC MÉCANIQUE FR ================= -->

<div class="unit-container">
    <div class="unit-header-box">
        <div class="unit-part-tag">Composante Physique • Semestre 1 • Mécanique (Total : 28 Heures)</div>
        <div class="unit-title">Axe 1 : Les Interactions • Unité 1 : Gravitation Universelle & Unité 2 : Actions Mécaniques</div>
        <div class="unit-meta-bar">
            <span><strong>Durée :</strong> 6 Heures (4h + 2h)</span>
            <span><strong>Filières :</strong> Tronc Commun Scientifique & Technologique</span>
        </div>
    </div>

    <div class="grid-two-col">
        <div class="info-card">
            <h4>📋 Prérequis Pédagogiques</h4>
            <ul>
                <li>Interactions mécaniques et effets d'une force (statique et dynamique).</li>
                <li>Forces de contact vs forces à distance.</li>
                <li>Distinction entre masse m (en kg) et poids P (en N).</li>
                <li>Principe des actions réciproques (3ème loi de Newton).</li>
            </ul>
        </div>
        <div class="info-card accent">
            <h4>❓ Situation-Problème & Questionnements</h4>
            <p>Le système solaire maintient la cohésion des planètes sur leurs orbites. À quoi est due cette stabilité cosmique ? Quelle différence fondamentale existe-t-il entre le poids d'un corps et l'attraction universelle ? Comment l'eau d'un barrage s'exerce-t-elle sur les parois ?</p>
        </div>
    </div>

    <div class="info-card" style="margin-bottom: 12px;">
        <h4>🎯 Compétences Visées & Objectifs d'Apprentissage</h4>
        <ul>
            <li>Maîtriser l'échelle des longueurs de l'atome aux galaxies et déterminer les ordres de grandeur (puissances de 10).</li>
            <li>Énoncer et appliquer la loi de la gravitation universelle : F = G · (m_A · m_B) / d² et représenter les forces d'interaction gravitationnelle.</li>
            <li>Comprendre l'expression du poids P = m · g, la variation du champ de pesanteur avec l'altitude : g(h) = g₀ · R_T² / (R_T + h)² et distinguer poids et masse.</li>
            <li>Inventorier et classifier les actions mécaniques (contact localisé/réparti, à distance, intérieures/extérieures).</li>
            <li>Définir la force pressante F et la pression P = F / S en Pascals (Pa) et en bars.</li>
        </ul>
    </div>

    <table class="table-sheet">
        <thead>
            <tr>
                <th style="width: 28%;">Axes & Contenus du Cours</th>
                <th style="width: 24%;">Moyens & Matériel Didactique</th>
                <th style="width: 26%;">Activités d'Enseignement-Apprentissage</th>
                <th style="width: 22%;">Modalités d'Évaluation</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>
                    <strong>I. La Gravitation Universelle</strong>
                    <ul>
                        <li>1. Échelle des longueurs & ordre de grandeur</li>
                        <li>2. Loi de gravitation universelle de Newton : F = G(m_A m_B)/d²</li>
                        <li>3. Champ de pesanteur g et poids d'un corps P = m·g</li>
                        <li>4. Variations de la pesanteur en altitude et latitude</li>
                    </ul>
                    <strong>II. Exemples d'Actions Mécaniques</strong>
                    <ul>
                        <li>1. Effet statique et dynamique d'une force</li>
                        <li>2. Caractéristiques vectorielles d'une force</li>
                        <li>3. Classification : contact localisé/réparti, à distance</li>
                        <li>4. Force pressante et notion de pression P = F / S</li>
                    </ul>
                </td>
                <td>
                    <ul>
                        <li>Manuel scolaire & tableau</li>
                        <li>Vidéos & animations astronomiques</li>
                        <li>Dynamomètres à ressorts étalonnés</li>
                        <li>Masses marquées en laiton et fer</li>
                        <li>Cloche à vide, pompe & ballons baudruche</li>
                        <li>Blocs de bois poli/rugueux et plans d'appui</li>
                        <li>Manomètre numérique & capteur de pression</li>
                    </ul>
                </td>
                <td>
                    <strong>Activité de l'Enseignant :</strong>
                    <ul>
                        <li>Guider le calcul des forces de gravitation entre planètes.</li>
                        <li>Illustrer la notion de pression et force pressante par des expériences simples.</li>
                        <li>Superviser la représentation vectorielle des forces.</li>
                    </ul>
                    <strong>Activité de l'Apprenant :</strong>
                    <ul>
                        <li>Déterminer l'ordre de grandeur de dimensions physiques.</li>
                        <li>Calculer l'intensité de la pesanteur à une altitude donnée.</li>
                        <li>Résoudre des problèmes de pression hydrostatique P = F / S.</li>
                    </ul>
                </td>
                <td>
                    <strong>Diagnostique :</strong>
                    <ul>
                        <li>Test de rappel sur les unités SI et l'écriture scientifique.</li>
                    </ul>
                    <strong>Formative :</strong>
                    <ul>
                        <li>Exercices de tracé vectoriel des forces gravitationnelles.</li>
                    </ul>
                    <strong>Sommative :</strong>
                    <ul>
                        <li>Contrôle surveillé N° 1 sur la gravitation et la pression.</li>
                    </ul>
                </td>
            </tr>
        </tbody>
    </table>
</div>

<div class="unit-container">
    <div class="unit-header-box">
        <div class="unit-part-tag">Composante Physique • Semestre 1 • Mécanique</div>
        <div class="unit-title">Axes 2 & 3 : Mouvement, Principe d'Inertie & Équilibre des Corps Solides</div>
        <div class="unit-meta-bar">
            <span><strong>Durée :</strong> 22 Heures</span>
            <span><strong>Filières :</strong> Tronc Commun Scientifique & Technologique</span>
        </div>
    </div>

    <div class="grid-two-col">
        <div class="info-card">
            <h4>📋 Prérequis Pédagogiques</h4>
            <ul>
                <li>Notions de mouvement et repos ; vitesse et trajectoire.</li>
                <li>Équilibre sous deux forces ; tension d'un ressort.</li>
                <li>Trigonométrie et projections orthogonales de vecteurs.</li>
            </ul>
        </div>
        <div class="info-card accent">
            <h4>❓ Situation-Problème & Questionnements</h4>
            <p>Les passagers d'un bus sont projetés en avant lors d'un freinage brutal. Le mouvement peut-il persister sans action mécanique ? Quelles conditions permettent l'équilibre d'un grimpeur sur paroi rocheuse, et pourquoi une clé à long manche facilite-t-elle le dévissage d'un écrou ?</p>
        </div>
    </div>

    <div class="info-card" style="margin-bottom: 12px;">
        <h4>🎯 Compétences Visées & Objectifs d'Apprentissage</h4>
        <ul>
            <li>Comprendre la relativité du mouvement, les référentiels spatio-temporels et calculer la vitesse moyenne/instantanée.</li>
            <li>Énoncer et appliquer le Principe d'Inertie (1ère loi de Newton) : ΣF_ext = 0 ⇔ v_G = const.</li>
            <li>Étudier l'équilibre sous 2 forces (F₁ + F₂ = 0), la tension du ressort T = k·|Δl|, la poussée d'Archimède F_A = ρ·V·g et le frottement statique.</li>
            <li>Étudier l'équilibre sous 3 forces non parallèles : coplanarité, concourance, méthodes géométrique et analytique de projection.</li>
            <li>Énoncer le Théorème des Moments : Σ M_Δ(F) = 0 pour la rotation autour d'un axe fixe ; calculer M_Δ(F) = ± F·d et le couple de torsion.</li>
        </ul>
    </div>

    <table class="table-sheet">
        <thead>
            <tr>
                <th style="width: 28%;">Axes & Contenus du Cours</th>
                <th style="width: 24%;">Moyens & Matériel Didactique</th>
                <th style="width: 26%;">Activités d'Enseignement-Apprentissage</th>
                <th style="width: 22%;">Modalités d'Évaluation</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>
                    <strong>I. Cinématique & Principe d'Inertie</strong>
                    <ul>
                        <li>1. Trajectoire et mouvements rectiligne/circulaire uniformes</li>
                        <li>2. Centre d'inertie G et relation barycentrique</li>
                        <li>3. Énoncé du Principe d'Inertie (1ère loi de Newton)</li>
                    </ul>
                    <strong>II. Équilibre Sous Deux Forces</strong>
                    <ul>
                        <li>1. Condition vectorielle : F₁ + F₂ = 0</li>
                        <li>2. Allongement du ressort et loi de Hooke T = k·Δl</li>
                        <li>3. Poussée d'Archimède et flottaison des corps</li>
                        <li>4. Frottement sur plan incliné & angle de frottement φ</li>
                    </ul>
                    <strong>III. Équilibre Sous Trois Forces</strong>
                    <ul>
                        <li>1. Conditions de coplanarité et concourance</li>
                        <li>2. Triangle des forces et projection sur repère orthonormé</li>
                    </ul>
                    <strong>IV. Rotation Autour d'un Axe Fixe</strong>
                    <ul>
                        <li>1. Moment d'une force : M_Δ(F) = ± F·d</li>
                        <li>2. Théorème des moments : Σ M_Δ(F) = 0</li>
                        <li>3. Couple de deux forces et couple de torsion M_c = -C·θ</li>
                    </ul>
                </td>
                <td>
                    <ul>
                        <li>Table à coussin d'air et mobiles autoportés à étincelage</li>
                        <li>Logiciel de pointage vidéo Avimeca / Regressi</li>
                        <li>Ressorts à spires non jointives de raideur k connue</li>
                        <li>Dynamomètres à cadran et rapporteurs circulaires</li>
                        <li>Disque d'équilibre à roulement à billes</li>
                        <li>Appareil à fil de torsion avec tige et index gradué</li>
                        <li>Éprouvettes et liquides de diverses masses volumiques</li>
                    </ul>
                </td>
                <td>
                    <strong>Activité de l'Enseignant :</strong>
                    <ul>
                        <li>Illustrer le mouvement rectiligne uniforme sans frottement.</li>
                        <li>Superviser la vérification expérimentale de la fermeture du dynamique des forces.</li>
                        <li>Faire vérifier le théorème des moments sur disque équilibré.</li>
                    </ul>
                    <strong>Activité de l'Apprenant :</strong>
                    <ul>
                        <li>Tracer la courbe d'étalonnage T = f(Δl) et calculer la raideur k.</li>
                        <li>Projeter les composantes scalaires des forces selon Ox et Oy.</li>
                        <li>Appliquer le théorème des moments pour déterminer une force inconnue.</li>
                    </ul>
                </td>
                <td>
                    <strong>Diagnostique :</strong>
                    <ul>
                        <li>Rappels de trigonométrie et de projection vectorielle.</li>
                    </ul>
                    <strong>Formative :</strong>
                    <ul>
                        <li>Exercices de résolution d'équilibre statique à 2 et 3 forces.</li>
                    </ul>
                    <strong>Sommative :</strong>
                    <ul>
                        <li>Devoir surveillé de mi-semestre en mécanique statique.</li>
                    </ul>
                </td>
            </tr>
        </tbody>
    </table>
</div>

<!-- ================= TC ÉLECTRICITÉ FR ================= -->

<div class="unit-container">
    <div class="unit-header-box">
        <div class="unit-part-tag">Composante Physique • Semestre 2 • Électricité (Total : 32 Heures)</div>
        <div class="unit-title">Courant, Tension, Résistances, Dipôles Actifs et Passifs, et Transistors</div>
        <div class="unit-meta-bar">
            <span><strong>Durée :</strong> 32 Heures</span>
            <span><strong>Filières :</strong> Tronc Commun Scientifique & Technologique</span>
        </div>
    </div>

    <div class="grid-two-col">
        <div class="info-card">
            <h4>📋 Prérequis Pédagogiques</h4>
            <ul>
                <li>Charges électriques : électrons libres dans les métaux et ions en solution.</li>
                <li>Circuits en courant continu : générateurs, lampes, interrupteurs.</li>
                <li>Utilisation des fonctions multimètre (ampèremètre, voltmètre).</li>
            </ul>
        </div>
        <div class="info-card accent">
            <h4>❓ Situation-Problème & Questionnements</h4>
            <p>De la foudre aux microprocesseurs, le courant électrique obéit à des lois rigoureuses. Comment les résistances divisent-elles la tension, quel est le rôle d'une diode dans un circuit, et comment le transistor amplifie-t-il les signaux électriques ?</p>
        </div>
    </div>

    <div class="info-card" style="margin-bottom: 12px;">
        <h4>🎯 Compétences Visées & Objectifs d'Apprentissage</h4>
        <ul>
            <li>Définir l'intensité I = Q / Δt ; appliquer la Loi des Nœuds (Σ I_entrant = Σ I_sortant).</li>
            <li>Mesurer les tensions U_AB = V_A - V_B ; appliquer la Loi des Mailles ; exploiter l'oscilloscope pour signaux alternatifs sinusoïdaux (U_max, U_eff = U_max / √2, T, f).</li>
            <li>Maîtriser la loi d'Ohm U = R · I ; calculer la résistance équivalente en série et en parallèle ; utiliser le pont diviseur de tension.</li>
            <li>Tracer et analyser les caractéristiques courant-tension des dipôles passifs : lampe, diode à jonction, diode Zener, DEL, thermistances et photorésistances.</li>
            <li>Étudier les générateurs linéaires : U_PN = E - r·I et les récepteurs : U_AB = E' + r'·I ; déterminer le point de fonctionnement et appliquer la loi de Pouillet.</li>
            <li>Comprendre le fonctionnement du transistor bipolaire NPN : base, collecteur, émetteur ; amplification (I_C = β·I_B) et commutation saturée/bloquée.</li>
        </ul>
    </div>

    <table class="table-sheet">
        <thead>
            <tr>
                <th style="width: 28%;">Axes & Contenus du Cours</th>
                <th style="width: 24%;">Moyens & Matériel Didactique</th>
                <th style="width: 26%;">Activités d'Enseignement-Apprentissage</th>
                <th style="width: 22%;">Modalités d'Évaluation</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>
                    <strong>I. Courant & Tension Électriques</strong>
                    <ul>
                        <li>1. Nature du courant et quantité de charge Q = I·t</li>
                        <li>2. Loi des nœuds en circuits série et dérivation</li>
                        <li>3. Tension électrique et loi des mailles</li>
                        <li>4. Tension alternative sinusoïdale à l'oscilloscope</li>
                    </ul>
                    <strong>II. Conducteurs Ohmiques & Diviseur de Tension</strong>
                    <ul>
                        <li>1. Loi d'Ohm U = R·I et résistance géométrique R = ρ·l/S</li>
                        <li>2. Associations série (R_eq = ΣR_i) et dérivation (1/R_eq = Σ1/R_i)</li>
                        <li>3. Montage diviseur de tension : U₂ = E · R₂ / (R₁ + R₂)</li>
                    </ul>
                    <strong>III. Dipôles Passifs et Actifs</strong>
                    <ul>
                        <li>1. Caractéristiques de diodes jonction, Zener et DEL</li>
                        <li>2. Équation du générateur : U_PN = E - r·I</li>
                        <li>3. Équation du récepteur : U = E' + r'·I</li>
                        <li>4. Point de fonctionnement & loi de Pouillet : I = (ΣE - ΣE') / ΣR</li>
                    </ul>
                    <strong>IV. Le Transistor Bipolaire</strong>
                    <ul>
                        <li>1. Électrodes (B, C, E) et gain en courant I_C = β·I_B</li>
                        <li>2. Régimes d'amplification linéaire et de commutation</li>
                    </ul>
                </td>
                <td>
                    <ul>
                        <li>Alimentation stabilisée continue réglable (0 - 30 V)</li>
                        <li>Générateur basse fréquence (GBF) & oscilloscope bicourbe</li>
                        <li>Multimètres numériques de précision</li>
                        <li>Résistances étalonnées, potentiomètres & rhéostats</li>
                        <li>Diodes silicium, diodes Zener, DEL, thermistances, LDR</li>
                        <li>Transistors bipolaires NPN (2N2222 / BC547)</li>
                        <li>Plaquette d'essai (breadboard) et cordons de raccordement</li>
                    </ul>
                </td>
                <td>
                    <strong>Activité de l'Enseignant :</strong>
                    <ul>
                        <li>Guider le relevé des mesures à l'oscilloscope (U_max et période T).</li>
                        <li>Conduire le tracé des caractéristiques courant-tension.</li>
                        <li>Expliquer le rôle d'amplification et de commutation du transistor.</li>
                    </ul>
                    <strong>Activité de l'Apprenant :</strong>
                    <ul>
                        <li>Câbler les circuits et vérifier expérimentalement la loi des nœuds et des mailles.</li>
                        <li>Tracer graphiquement la droite de charge et relever le point de fonctionnement.</li>
                        <li>Réaliser un montage détecteur d'obscurité à base de LDR et transistor.</li>
                    </ul>
                </td>
                <td>
                    <strong>Diagnostique :</strong>
                    <ul>
                        <li>Vérification du branchement correct de l'ampèremètre et du voltmètre.</li>
                    </ul>
                    <strong>Formative :</strong>
                    <ul>
                        <li>Calculs de circuits par la loi de Pouillet et le diviseur de tension.</li>
                    </ul>
                    <strong>Sommative :</strong>
                    <ul>
                        <li>Évaluation sommative semestrielle en électricité.</li>
                    </ul>
                </td>
            </tr>
        </tbody>
    </table>
</div>

<!-- ================= TC CHIMIE FR ================= -->

<div class="unit-container">
    <div class="unit-header-box">
        <div class="unit-part-tag">Composante Chimie • Semestre 1 & 2 • (Total : 42 Heures)</div>
        <div class="unit-title">La Chimie Autour de Nous, Structure de l'Atome, Classification & Transformations</div>
        <div class="unit-meta-bar">
            <span><strong>Durée :</strong> 42 Heures</span>
            <span><strong>Filières :</strong> Tronc Commun Scientifique & Technologique</span>
        </div>
    </div>

    <div class="grid-two-col">
        <div class="info-card">
            <h4>📋 Prérequis Pédagogiques</h4>
            <ul>
                <li>États de la matière et changements d'états physiques.</li>
                <li>Notions d'atome, molécule et réaction chimique.</li>
                <li>Verrerie de laboratoire et consignes de sécurité chimique.</li>
            </ul>
        </div>
        <div class="info-card accent">
            <h4>❓ Situation-Problème & Questionnements</h4>
            <p>De l'extraction de l'essence de lavande à la synthèse d'arômes artificiels, la chimie relie le monde invisible des atomes aux produits du quotidien. Qu'est-ce qu'une mole ? Comment les électrons dictent-ils les liaisons et le bilan de matière ?</p>
        </div>
    </div>

    <div class="info-card" style="margin-bottom: 12px;">
        <h4>🎯 Compétences Visées & Objectifs d'Apprentissage</h4>
        <ul>
            <li>Distinguer espèces chimiques naturelles et synthétiques ; réaliser hydrodistillation, extraction par solvant et chromatographie sur couche mince (CCM).</li>
            <li>Réaliser une synthèse organique à reflux (synthèse de l'acétate de linalyle).</li>
            <li>Maîtriser la constitution du noyau (^A_Z X, isotopes) et la répartition électronique en couches (K)², (L)⁸, (M)⁸.</li>
            <li>Appliquer les règles du duet et de l'octet pour établir la représentation de Lewis et la géométrie de Cram.</li>
            <li>Maîtriser le tableau périodique : numéro atomique Z, périodes, colonnes (familles alcalins, halogènes, gaz nobles).</li>
            <li>Définir la mole, la constante d'Avogadro N_A = 6,022 × 10²³ mol⁻¹, la masse molaire M, le volume molaire V_m et la loi des gaz parfaits P·V = n·R·T.</li>
            <li>Préparer des solutions par dissolution (m = C·V·M) et dilution (C_i · V_i = C_f · V_f) ; dresser un tableau d'avancement complet.</li>
        </ul>
    </div>

    <table class="table-sheet">
        <thead>
            <tr>
                <th style="width: 28%;">Axes & Contenus du Cours</th>
                <th style="width: 24%;">Moyens & Matériel Didactique</th>
                <th style="width: 26%;">Activités d'Enseignement-Apprentissage</th>
                <th style="width: 22%;">Modalités d'Évaluation</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>
                    <strong>I. La Chimie Autour de Nous</strong>
                    <ul>
                        <li>1. Espèces chimiques : tests de caractérisation</li>
                        <li>2. Hydrodistillation de la lavande & extraction par solvant</li>
                        <li>3. Chromatographie sur couche mince (CCM) & rapport frontal R_f</li>
                        <li>4. Synthèse à reflux et séparation d'espèces</li>
                    </ul>
                    <strong>II. L'Atome & la Classification Périodique</strong>
                    <ul>
                        <li>1. Constitution du noyau atomique et cortège électronique</li>
                        <li>2. Structure électronique (K, L, M) et électrons de valence</li>
                        <li>3. Tableau périodique et familles chimiques</li>
                        <li>4. Règles du duet/octet, représentations de Lewis et Cram</li>
                    </ul>
                    <strong>III. Description du Système Chimique & La Mole</strong>
                    <ul>
                        <li>1. Quantité de matière n = N / N_A = m / M</li>
                        <li>2. Cas des gaz : n = V / V_m et équation P·V = n·R·T</li>
                        <li>3. Concentration molaire C = n / V et protocole de dilution</li>
                    </ul>
                    <strong>IV. Transformations Chimiques & Tableau d'Avancement</strong>
                    <ul>
                        <li>1. Modélisation de la réaction et coefficients stœchiométriques</li>
                        <li>2. Tableau d'avancement de réaction (état initial, en cours, final)</li>
                        <li>3. Réactif limitant et avancement maximal x_max</li>
                    </ul>
                </td>
                <td>
                    <ul>
                        <li>Montage d'hydrodistillation complet avec ballon et chauffe-ballon</li>
                        <li>Ampoules à décanter, cuves à élution CCM, plaques de silice</li>
                        <li>Modèles moléculaires boules et bâtonnets</li>
                        <li>Tableau périodique des éléments grand format</li>
                        <li>Balances électroniques au milligramme près</li>
                        <li>Fioles jaugées, pipettes graduées et propipettes</li>
                        <li>Réactifs : CuSO₄, NaOH, liqueur de Fehling, cyclohexane</li>
                    </ul>
                </td>
                <td>
                    <strong>Activité de l'Enseignant :</strong>
                    <ul>
                        <li>Encadrer les travaux pratiques d'extraction et de chromatographie.</li>
                        <li>Faire manipuler les modèles moléculaires pour visualiser les liaisons 3D.</li>
                        <li>Expliquer la démarche rigoureuse du tableau d'avancement.</li>
                    </ul>
                    <strong>Activité de l'Apprenant :</strong>
                    <ul>
                        <li>Réaliser la CCM, mesurer les rapports frontaux et identifier les composés.</li>
                        <li>Établir les structures de Lewis de H₂O, CH₄, NH₃, CO₂.</li>
                        <li>Calculer des quantités de matière et déterminer le réactif limitant.</li>
                    </ul>
                </td>
                <td>
                    <strong>Diagnostique :</strong>
                    <ul>
                        <li>Rappel des consignes de sécurité et pictogrammes de danger.</li>
                    </ul>
                    <strong>Formative :</strong>
                    <ul>
                        <li>Exercices de calcul de masse de soluté et facteur de dilution.</li>
                    </ul>
                    <strong>Sommative :</strong>
                    <ul>
                        <li>Devoirs surveillés semestriels de chimie générale.</li>
                    </ul>
                </td>
            </tr>
        </tbody>
    </table>
</div>

</body>
</html>"""

def get_1bac_english_html():
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>1st Year Baccalaureate Sciences - Physics & Chemistry Lesson Plans</title>
<style>{CSS_STYLE}</style>
</head>
<body>

<div class="cover-page">
    <div class="cover-badge">Kingdom of Morocco • Secondary Education</div>
    <div class="cover-title">Pedagogical Lesson Plans</div>
    <div class="cover-subtitle">Physics & Chemistry (1st Year Baccalaureate - Sciences)</div>
    <div style="font-size: 12pt; color: #475569; max-width: 500px; margin: 0 auto 30px auto;">
        Experimental Sciences (Physics-Chemistry, Life & Earth Sciences, Agronomy) & Mathematical Sciences (A & B)
    </div>
    <div class="cover-author">
        <strong>Prepared by:</strong> Professor AYOUB KHAMMOUR<br>
        <span style="font-size: 10.5pt; color: #64748b;">Registration No: 1503811</span>
    </div>
    <div class="cover-meta">
        Official Reference: National Educational Orientations • Ministerial Memos 09-142 & 144 • Approved Textbooks
    </div>
</div>

<!-- ================= 1BAC MECHANICS EN ================= -->

<div class="unit-container">
    <div class="unit-header-box">
        <div class="unit-part-tag">Physics Component • Part 1: Mechanical Work & Energy (Total: 34 - 45 Hours)</div>
        <div class="unit-title">Rotational Motion, Work & Power, Kinetic Energy, Potential & Mechanical Energy</div>
        <div class="unit-meta-bar">
            <span><strong>Duration:</strong> 34 - 45 Hours</span>
            <span><strong>Streams:</strong> 1BAC Experimental Sciences & Mathematical Sciences</span>
        </div>
    </div>

    <div class="grid-two-col">
        <div class="info-card">
            <h4>📋 Prerequisites</h4>
            <ul>
                <li>Average/instantaneous velocity, inertia principle, and center of mass.</li>
                <li>Equilibrium under forces, moment of force, and theorem of moments.</li>
                <li>Hooke's spring law and fluid static pressure.</li>
            </ul>
        </div>
        <div class="info-card accent">
            <h4>❓ Guiding Problem Situation</h4>
            <p>From hydroelectric turbines to blender blades and pole vaulters clearing crossbars, mechanical work transforms between kinetic and potential forms. What governs rotational dynamics? How is the Kinetic Energy Theorem formulated for translation and rotation?</p>
        </div>
    </div>

    <div class="info-card" style="margin-bottom: 12px;">
        <h4>🎯 Targeted Competencies & Learning Objectives</h4>
        <ul>
            <li>Kinematics of rotation around a fixed axis: angular coordinate θ(t), angular velocity ω = dθ/dt, linear velocity v = r·ω, and uniform rotation equation θ(t) = ω·t + θ₀.</li>
            <li>Work of constant force: W_AB(F) = F · AB · cos(α); work of weight: W_AB(P) = m·g·(z_A - z_B); work of torque W(M_Δ) = M_Δ · Δθ; average & instantaneous power P = F · v = M_Δ · ω.</li>
            <li>Kinetic energy E_k = 0.5·m·v² (translation) and E_k = 0.5·J_Δ·ω² (rotation); apply Kinetic Energy Theorem: ΔE_k = Σ W_AB(F_ext).</li>
            <li>Gravitational potential energy E_pp = m·g·z + C (choice of reference plane); verify ΔE_pp = -W_AB(P).</li>
            <li>Mechanical energy E_m = E_k + E_pp; analyze conservation in conservative systems (ΔE_m = 0) and dissipation through friction (ΔE_m = W(f) = -Q_thermal).</li>
            <li>1st Law of Thermodynamics (ΔU = W + Q) and Calorimetry: Q = m·c·Δθ and latent heat of phase change Q = m·L.</li>
        </ul>
    </div>

    <table class="table-sheet">
        <thead>
            <tr>
                <th style="width: 28%;">Course Outline</th>
                <th style="width: 24%;">Didactic Aids & Equipment</th>
                <th style="width: 26%;">Learning Activities</th>
                <th style="width: 22%;">Assessment Strategy</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>
                    <strong>I. Solid Rotation Around Fixed Axis</strong>
                    <ul>
                        <li>1. Angular position θ, velocity ω, and period T = 2π/ω</li>
                        <li>2. Uniform rotation equation θ(t) = ω·t + θ₀</li>
                    </ul>
                    <strong>II. Work and Power of Forces</strong>
                    <ul>
                        <li>1. Constant force work W = F·AB·cos(α) (motoring vs resistive)</li>
                        <li>2. Work of weight W(P) = ± m·g·h (path independent)</li>
                        <li>3. Work of torque W = M_Δ · Δθ & power P = M_Δ · ω</li>
                    </ul>
                    <strong>III. Kinetic Energy & Theorem</strong>
                    <ul>
                        <li>1. Translation E_k = 0.5 m v² & rotation E_k = 0.5 J_Δ ω²</li>
                        <li>2. Kinetic Energy Theorem: ΔE_k = Σ W_ext</li>
                    </ul>
                    <strong>IV. Potential & Mechanical Energy</strong>
                    <ul>
                        <li>1. E_pp = m·g·z + C & relation ΔE_pp = -W(P)</li>
                        <li>2. Mechanical energy E_m = E_k + E_pp & conservation</li>
                        <li>3. Non-conservation with friction & thermal conversion</li>
                    </ul>
                    <strong>V. Internal Energy & Calorimetry</strong>
                    <ul>
                        <li>1. 1st Law of Thermodynamics: ΔU = W + Q</li>
                        <li>2. Heat transfer Q = m·c·Δθ & latent heat Q = m·L</li>
                    </ul>
                </td>
                <td>
                    <ul>
                        <li>Air cushion table with spark timer & rotational disc</li>
                        <li>Free-fall timer apparatus with electromagnet</li>
                        <li>Stands, inclined plane & low-friction gliders</li>
                        <li>Moment of inertia wheel with hanging masses</li>
                        <li>Insulated calorimeter with stirrer and digital thermometer</li>
                        <li>Known metal samples (Al, Cu, Fe, Pb) & ice bath</li>
                        <li>Video camera & Avimeca motion tracking software</li>
                    </ul>
                </td>
                <td>
                    <strong>Teacher:</strong>
                    <ul>
                        <li>Guide verification of kinetic energy theorem for free fall and rolling.</li>
                        <li>Demonstrate mechanical energy conservation on a frictionless track.</li>
                        <li>Supervise calorimetric determination of metal specific heat capacity c.</li>
                    </ul>
                    <strong>Student:</strong>
                    <ul>
                        <li>Calculate work of weight along complex trajectories.</li>
                        <li>Apply Kinetic Energy Theorem to calculate velocity at any point.</li>
                        <li>Perform calorimetry measurements and solve thermal equilibrium equations.</li>
                    </ul>
                </td>
                <td>
                    <strong>Diagnostic:</strong>
                    <ul>
                        <li>Vectors, energy forms, and trigonometry review quiz.</li>
                    </ul>
                    <strong>Formative:</strong>
                    <ul>
                        <li>Kinetic energy theorem problem sets on inclined planes.</li>
                    </ul>
                    <strong>Summative:</strong>
                    <ul>
                        <li>Supervised Exam 1 on mechanics, energy, and calorimetry.</li>
                    </ul>
                </td>
            </tr>
        </tbody>
    </table>
</div>

<!-- ================= 1BAC ELECTRICITY & OPTICS EN ================= -->

<div class="unit-container">
    <div class="unit-header-box">
        <div class="unit-part-tag">Physics Component • Part 2: Electricity & Part 3: Optics (Total: 37 - 60 Hours)</div>
        <div class="unit-title">Electrostatics, Circuit Energy, Magnetic Fields, Laplace Force, and Geometric Optics</div>
        <div class="unit-meta-bar">
            <span><strong>Duration:</strong> 37 - 60 Hours</span>
            <span><strong>Streams:</strong> 1BAC Experimental Sciences & Mathematical Sciences</span>
        </div>
    </div>

    <div class="grid-two-col">
        <div class="info-card">
            <h4>📋 Prerequisites</h4>
            <ul>
                <li>Current, voltage, Ohm's law, and resistor combinations.</li>
                <li>Magnetic poles of magnets and compass needle orientations.</li>
                <li>Rectilinear light propagation, reflection, and refraction.</li>
            </ul>
        </div>
        <div class="info-card accent">
            <h4>❓ Guiding Problem Situation</h4>
            <p>From particle accelerators using electric fields to magnetic levitation and electric motors powered by Laplace forces, electromagnetism drives modern industry. How do converging lenses form magnified images in microscopes?</p>
        </div>
    </div>

    <div class="info-card" style="margin-bottom: 12px;">
        <h4>🎯 Targeted Competencies & Learning Objectives</h4>
        <ul>
            <li>Understand electrostatic field E: F = q · E; work W_AB(F_e) = q · (V_A - V_B); potential energy E_pe = q · V + C; uniform field E = U / d.</li>
            <li>Analyze energy transfer in circuits: electrical energy W = U · I · Δt; Joule effect W_J = R · I² · Δt; generator/receiver efficiency η.</li>
            <li>Characterize magnetic fields B: vector representation, field lines, sources (Earth, permanent magnets, currents: wire B = μ₀·I/(2πr), circular coil, solenoid B = μ₀·n·I).</li>
            <li>Master Laplace force: F = I · (L × B) with F = I · L · B · sin(α); explain DC motors and dynamic loudspeakers.</li>
            <li>Optics: Snell-Descartes reflection/refraction laws; plane mirrors; thin converging lenses: thin lens formula 1/OA' - 1/OA = 1/OF' and magnification γ = A'B'/AB = OA'/OA.</li>
        </ul>
    </div>

    <table class="table-sheet">
        <thead>
            <tr>
                <th style="width: 28%;">Course Outline</th>
                <th style="width: 24%;">Didactic Aids & Equipment</th>
                <th style="width: 26%;">Learning Activities</th>
                <th style="width: 22%;">Assessment Strategy</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>
                    <strong>I. Electrostatic Field & Potential Energy</strong>
                    <ul>
                        <li>1. Coulomb force & field vector E</li>
                        <li>2. Uniform field between parallel plates E = U/d</li>
                        <li>3. Work of electrostatic force W = q(V_A - V_B) & potential energy</li>
                    </ul>
                    <strong>II. Circuit Energy Transfer & Efficiency</strong>
                    <ul>
                        <li>1. Electrical power P = U·I & Joule's law P_J = R·I²</li>
                        <li>2. Generator efficiency η_g and receiver efficiency η_r</li>
                    </ul>
                    <strong>III. Magnetic Fields & Laplace Force</strong>
                    <ul>
                        <li>1. Magnetic field B (Tesla) & field lines</li>
                        <li>2. Field produced by straight wire, flat coil, and solenoid</li>
                        <li>3. Laplace force F = I·L·B·sin(α) & DC motor principle</li>
                    </ul>
                    <strong>IV. Geometric Optics & Lenses</strong>
                    <ul>
                        <li>1. Plane mirror image characteristics (virtual, symmetric)</li>
                        <li>2. Thin converging lens: focal length f' = OF', optical power C = 1/f'</li>
                        <li>3. Conjugation formula: 1/OA' - 1/OA = 1/f' & magnification γ</li>
                    </ul>
                </td>
                <td>
                    <ul>
                        <li>High voltage DC power supply & parallel plate capacitor</li>
                        <li>Electrostatic pendulum & semolina grains in oil bath</li>
                        <li>Teslameter with Hall effect axial and transverse probes</li>
                        <li>Solenoid, circular coil & straight conductor rails</li>
                        <li>Laplace rails experiment apparatus with horseshoe magnet</li>
                        <li>Optical bench with converging lenses (+5, +10, +20 δ), illuminated object & screen</li>
                        <li>Plane mirrors, laser ray box & optical protractor</li>
                    </ul>
                </td>
                <td>
                    <strong>Teacher:</strong>
                    <ul>
                        <li>Demonstrate field lines in oil with high voltage.</li>
                        <li>Map magnetic field of solenoid as function of current and turn density.</li>
                        <li>Guide lens image formation on optical bench and verify conjugation law.</li>
                    </ul>
                    <strong>Student:</strong>
                    <ul>
                        <li>Measure magnetic field B inside solenoid and verify B = μ₀·n·I.</li>
                        <li>Apply right-hand rule to predict Laplace force direction on conductor rail.</li>
                        <li>Construct real and virtual images through converging lenses and compute magnification.</li>
                    </ul>
                </td>
                <td>
                    <strong>Diagnostic:</strong>
                    <ul>
                        <li>Recall electric circuit and magnetic pole rules.</li>
                    </ul>
                    <strong>Formative:</strong>
                    <ul>
                        <li>Lens formula calculations and ray tracing tests.</li>
                    </ul>
                    <strong>Summative:</strong>
                    <ul>
                        <li>End-of-term exams on electromagnetism and optics.</li>
                    </ul>
                </td>
            </tr>
        </tbody>
    </table>
</div>

<!-- ================= 1BAC CHEMISTRY EN ================= -->

<div class="unit-container">
    <div class="unit-header-box">
        <div class="unit-part-tag">Chemistry Component • Semester 1 & 2 • (Total: 41 Hours)</div>
        <div class="unit-title">Measurement in Chemistry, Conductometry, Redox Titrations & Organic Chemistry</div>
        <div class="unit-meta-bar">
            <span><strong>Duration:</strong> 41 Hours</span>
            <span><strong>Streams:</strong> 1BAC Experimental Sciences & Mathematical Sciences</span>
        </div>
    </div>

    <div class="grid-two-col">
        <div class="info-card">
            <h4>📋 Prerequisites</h4>
            <ul>
                <li>The mole, molar mass, and molar concentration C = n / V.</li>
                <li>Ideal gas equation P·V = n·R·T and ICE progress tables.</li>
                <li>Electrolytic solutions and ions in water.</li>
            </ul>
        </div>
        <div class="info-card accent">
            <h4>❓ Guiding Problem Situation</h4>
            <p>Conductometry measures water purity by tracking ion migration, while redox titrations determine vitamin C in juices. In organic chemistry, petroleum cracking produces fuels and plastics. How do functional groups dictate chemical reactivity?</p>
        </div>
    </div>

    <div class="info-card" style="margin-bottom: 12px;">
        <h4>🎯 Targeted Competencies & Learning Objectives</h4>
        <ul>
            <li>Conductance G = 1/R = I/U and conductivity σ = G · (l/S); Kohlrausch's Law: σ = Σ λ_i · [X_i]; establish conductometric calibration curves.</li>
            <li>Brønsted-Lowry acid-base reactions: conjugate acid-base couples HA/A⁻; amphoteric species (H₂O).</li>
            <li>Redox reactions: oxidizing agent (Ox), reducing agent (Red), and electron transfer half-reactions; balance complex redox equations in acidic medium.</li>
            <li>Direct titrations (pH-metric, conductometric, colored indicator): write titration reaction, identify equivalence point, and calculate unknown concentration C_A = C_B · V_BE / V_A.</li>
            <li>Organic chemistry: carbon hybridization, straight/branched/cyclic carbon skeletons; alkanes, alkenes, and systematic IUPAC nomenclature; structural and geometric (Z/E) isomerism.</li>
            <li>Carbon chain modification: catalytic cracking, reforming, and addition polymerization; mild oxidation of primary, secondary, and tertiary alcohols using acidified KMnO₄.</li>
        </ul>
    </div>

    <table class="table-sheet">
        <thead>
            <tr>
                <th style="width: 28%;">Course Outline</th>
                <th style="width: 24%;">Didactic Aids & Equipment</th>
                <th style="width: 26%;">Learning Activities</th>
                <th style="width: 22%;">Assessment Strategy</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>
                    <strong>I. Conductance & Conductivity</strong>
                    <ul>
                        <li>1. Conductance G = I / U (Siemens) & cell constant K_cell = S / l</li>
                        <li>2. Conductivity σ = K_cell · G & Kohlrausch's law σ = Σ λ_i·[X_i]</li>
                        <li>3. Conductometric determination of unknown concentration</li>
                    </ul>
                    <strong>II. Acid-Base & Redox Reactions</strong>
                    <ul>
                        <li>1. Proton exchange in acid-base couples HA/A⁻</li>
                        <li>2. Electron transfer in redox couples Ox/Red</li>
                        <li>3. Half-equations & overall balanced reaction in acidic media</li>
                    </ul>
                    <strong>III. Direct Titrations</strong>
                    <ul>
                        <li>1. Equivalence condition: stoichiometric ratio n_A / a = n_B / b</li>
                        <li>2. Colorimetric & conductometric titrations (titration curves)</li>
                    </ul>
                    <strong>IV. Organic Chemistry & Alcohols</strong>
                    <ul>
                        <li>1. Carbon skeletons: alkanes & alkenes naming (IUPAC rules)</li>
                        <li>2. Chain modifications: catalytic cracking & polymerization</li>
                        <li>3. Classes of alcohols (1°, 2°, 3°) & mild oxidation (aldehydes, ketones, carboxylic acids)</li>
                    </ul>
                </td>
                <td>
                    <ul>
                        <li>Digital conductometer with cell (platinum plates) & standard KCl solutions</li>
                        <li>Precision burettes (25 mL), volumetric pipettes (10, 20 mL), magnetic stirrers</li>
                        <li>Standard solutions: KMnO₄, FeSO₄, Mohr salt, HCl, NaOH, I₂, Na₂S₂O₃</li>
                        <li>Organic reagents: Butan-1-ol, butan-2-ol, 2-methylpropan-2-ol, acidified KMnO₄</li>
                        <li>2,4-DNPH reagent, Fehling solution, Tollens reagent</li>
                        <li>Molecular model sets & organic glassware kits</li>
                    </ul>
                </td>
                <td>
                    <strong>Teacher:</strong>
                    <ul>
                        <li>Demonstrate conductometric calibration and ion molar conductivities.</li>
                        <li>Guide direct redox titration of iron(II) with potassium permanganate.</li>
                        <li>Supervise mild oxidation tests of primary and secondary alcohols with 2,4-DNPH and Fehling tests.</li>
                    </ul>
                    <strong>Student:</strong>
                    <ul>
                        <li>Plot conductometric titration curves and locate the intersection equivalence point.</li>
                        <li>Write balanced redox equations using half-reaction method.</li>
                        <li>Name organic compounds according to IUPAC rules and distinguish alcohol oxidation products.</li>
                    </ul>
                </td>
                <td>
                    <strong>Diagnostic:</strong>
                    <ul>
                        <li>Balancing chemical reactions and mole concept review.</li>
                    </ul>
                    <strong>Formative:</strong>
                    <ul>
                        <li>Titration stoichiometry calculations and organic nomenclature worksheets.</li>
                    </ul>
                    <strong>Summative:</strong>
                    <ul>
                        <li>Supervised Baccalaureate-style exams on solution chemistry and organic synthesis.</li>
                    </ul>
                </td>
            </tr>
        </tbody>
    </table>
</div>

</body>
</html>"""

def get_1bac_french_html():
    return f"""<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>1ère Année Baccalauréat Sciences - Fiches Pédagogiques de Physique-Chimie</title>
<style>{CSS_STYLE}</style>
</head>
<body>

<div class="cover-page">
    <div class="cover-badge">Royaume du Maroc • Enseignement Secondaire Qualifiant</div>
    <div class="cover-title">Fiches Pédagogiques</div>
    <div class="cover-subtitle">Physique - Chimie (1ère Année du Baccalauréat)</div>
    <div style="font-size: 12pt; color: #475569; max-width: 500px; margin: 0 auto 30px auto;">
        Filières des Sciences Expérimentales (Sciences Physiques, SVT, Sciences Agronomiques) & Sciences Mathématiques (A et B)
    </div>
    <div class="cover-author">
        <strong>Conception et Réalisation :</strong> Professeur AYOUB KHAMMOUR<br>
        <span style="font-size: 10.5pt; color: #64748b;">N° SOM : 1503811</span>
    </div>
    <div class="cover-meta">
        Cadre de Référence Officiel : Orientations Pédagogiques • Notes Ministérielles N° 09-142 et 144 • Manuels Scolaires Agréés
    </div>
</div>

<!-- ================= 1BAC MÉCANIQUE FR ================= -->

<div class="unit-container">
    <div class="unit-header-box">
        <div class="unit-part-tag">Composante Physique • Partie 1 : Travail Mécanique & Énergie (Total : 34 - 45 Heures)</div>
        <div class="unit-title">Rotation, Travail et Puissance, Énergie Cinétique, Énergie Potentielle et Mécanique</div>
        <div class="unit-meta-bar">
            <span><strong>Durée :</strong> 34 - 45 Heures</span>
            <span><strong>Filières :</strong> 1BAC Sciences Expérimentales & Sciences Mathématiques</span>
        </div>
    </div>

    <div class="grid-two-col">
        <div class="info-card">
            <h4>📋 Prérequis Pédagogiques</h4>
            <ul>
                <li>Vitesse moyenne et instantanée, principe d'inertie et centre d'inertie.</li>
                <li>Équilibre d'un solide, moment d'une force et théorème des moments.</li>
                <li>Tension d'un ressort et pression dans les fluides.</li>
            </ul>
        </div>
        <div class="info-card accent">
            <h4>❓ Situation-Problème & Questionnements</h4>
            <p>Des turbines hydroélectriques aux pales d'un mixeur et au saut à la perche, le travail mécanique se convertit continuellement entre formes cinétique et potentielle. Quelles lois régissent la rotation d'un solide et le Théorème de l'Énergie Cinétique ?</p>
        </div>
    </div>

    <div class="info-card" style="margin-bottom: 12px;">
        <h4>🎯 Compétences Visées & Objectifs d'Apprentissage</h4>
        <ul>
            <li>Cinématique de rotation autour d'un axe fixe : abscisse angulaire θ(t), vitesse angulaire ω = dθ/dt, relation v = r·ω et équation horaire θ(t) = ω·t + θ₀.</li>
            <li>Travail d'une force constante : W_AB(F) = F · AB · cos(α) ; travail du poids : W_AB(P) = m·g·(z_A - z_B) ; travail d'un couple W(M_Δ) = M_Δ · Δθ ; puissances moyenne et instantanée P = F · v = M_Δ · ω.</li>
            <li>Énergie cinétique de translation E_c = 0,5·m·v² et de rotation E_c = 0,5·J_Δ·ω² ; Théorème de l'Énergie Cinétique : ΔE_c = Σ W_AB(F_ext).</li>
            <li>Énergie potentielle de pesanteur E_pp = m·g·z + Cte (choix de l'état de référence) et relation fondamentale ΔE_pp = -W_AB(P).</li>
            <li>Énergie mécanique E_m = E_c + E_pp ; conservation en l'absence de frottements (ΔE_m = 0) et dissipation thermique par frottement (ΔE_m = W(f) = -Q).</li>
            <li>1er Principe de la thermodynamique (ΔU = W + Q) et calorimétrie : Q = m·c·Δθ et chaleur latente de changement d'état Q = m·L.</li>
        </ul>
    </div>

    <table class="table-sheet">
        <thead>
            <tr>
                <th style="width: 28%;">Axes & Contenus du Cours</th>
                <th style="width: 24%;">Moyens & Matériel Didactique</th>
                <th style="width: 26%;">Activités d'Enseignement-Apprentissage</th>
                <th style="width: 22%;">Modalités d'Évaluation</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>
                    <strong>I. Rotation d'un Solide Autour d'un Axe Fixe</strong>
                    <ul>
                        <li>1. Abscisse angulaire θ, vitesse angulaire ω & période T = 2π/ω</li>
                        <li>2. Équation horaire de rotation uniforme θ(t) = ω·t + θ₀</li>
                    </ul>
                    <strong>II. Travail & Puissance d'une Force</strong>
                    <ul>
                        <li>1. Travail d'une force constante W = F·AB·cos(α) (moteur/résistant)</li>
                        <li>2. Travail du poids W(P) = ± m·g·h (indépendant du chemin suivi)</li>
                        <li>3. Travail d'un couple W = M_Δ · Δθ & puissance P = M_Δ · ω</li>
                    </ul>
                    <strong>III. Énergie Cinétique & Théorème</strong>
                    <ul>
                        <li>1. Translation E_c = 0,5 m v² & rotation E_c = 0,5 J_Δ ω²</li>
                        <li>2. Énoncé du Théorème de l'Énergie Cinétique : ΔE_c = Σ W_ext</li>
                    </ul>
                    <strong>IV. Énergie Potentielle & Énergie Mécanique</strong>
                    <ul>
                        <li>1. Énergie potentielle E_pp = m·g·z + C & relation ΔE_pp = -W(P)</li>
                        <li>2. Énergie mécanique E_m = E_c + E_pp & conservation</li>
                        <li>3. Non-conservation avec frottements et dégradation thermique</li>
                    </ul>
                    <strong>V. Énergie Interne & Calorimétrie</strong>
                    <ul>
                        <li>1. Premier principe de la thermodynamique : ΔU = W + Q</li>
                        <li>2. Quantité de chaleur Q = m·c·Δθ & chaleur latente Q = m·L</li>
                    </ul>
                </td>
                <td>
                    <ul>
                        <li>Table à coussin d'air, disque tournant & chronophotographie</li>
                        <li>Dispositif de chute libre avec électro-aimant et capteurs</li>
                        <li>Plan incliné réglable et chariots mobiles</li>
                        <li>Volant d'inertie avec masses suspendues</li>
                        <li>Calorimètre adiabatique avec agitateur et thermomètre numérique</li>
                        <li>Échantillons métalliques calibrés (Al, Cu, Fe, Pb) et glace</li>
                        <li>Caméra et logiciel de pointage Avimeca / Regressi</li>
                    </ul>
                </td>
                <td>
                    <strong>Activité de l'Enseignant :</strong>
                    <ul>
                        <li>Guider la vérification expérimentale du théorème de l'énergie cinétique.</li>
                        <li>Faire observer la conservation de l'énergie mécanique sur banc sans frottement.</li>
                        <li>Superviser les manipulations calorimétriques de détermination de c.</li>
                    </ul>
                    <strong>Activité de l'Apprenant :</strong>
                    <ul>
                        <li>Calculer le travail du poids le long de trajectoires variées.</li>
                        <li>Appliquer le théorème de l'énergie cinétique pour déterminer des vitesses.</li>
                        <li>Résoudre l'équation d'équilibre thermique du calorimètre.</li>
                    </ul>
                </td>
                <td>
                    <strong>Diagnostique :</strong>
                    <ul>
                        <li>Contrôle sur les grandeurs cinématiques et les vecteurs forces.</li>
                    </ul>
                    <strong>Formative :</strong>
                    <ul>
                        <li>Exercices d'application du théorème de l'énergie cinétique sur plan incliné.</li>
                    </ul>
                    <strong>Sommative :</strong>
                    <ul>
                        <li>Devoir surveillé N° 1 sur la mécanique, l'énergie et la calorimétrie.</li>
                    </ul>
                </td>
            </tr>
        </tbody>
    </table>
</div>

<!-- ================= 1BAC ÉLECTRICITÉ & OPTIQUE FR ================= -->

<div class="unit-container">
    <div class="unit-header-box">
        <div class="unit-part-tag">Composante Physique • Partie 2 : Électricité & Partie 3 : Optique (Total : 37 - 60 Heures)</div>
        <div class="unit-title">Électrostatique, Énergie Électrique, Champ Magnétique, Force de Laplace et Optique Géométrique</div>
        <div class="unit-meta-bar">
            <span><strong>Durée :</strong> 37 - 60 Heures</span>
            <span><strong>Filières :</strong> 1BAC Sciences Expérimentales & Sciences Mathématiques</span>
        </div>
    </div>

    <div class="grid-two-col">
        <div class="info-card">
            <h4>📋 Prérequis Pédagogiques</h4>
            <ul>
                <li>Courant, tension, loi d'Ohm et associations de résistances.</li>
                <li>Pôles magnétiques d'un aimant et orientation de l'aiguille aimantée.</li>
                <li>Propagation rectiligne de la lumière, réflexion et réfraction.</li>
            </ul>
        </div>
        <div class="info-card accent">
            <h4>❓ Situation-Problème & Questionnements</h4>
            <p>Des accélérateurs de particules utilisant le champ électrostatique aux moteurs électriques animés par les forces de Laplace, l'électromagnétisme transforme l'énergie. Comment les lentilles convergentes forment-elles des images agrandies dans les microscopes ?</p>
        </div>
    </div>

    <div class="info-card" style="margin-bottom: 12px;">
        <h4>🎯 Compétences Visées & Objectifs d'Apprentissage</h4>
        <ul>
            <li>Maîtriser le champ électrostatique E : F = q · E ; travail W_AB(F_e) = q · (V_A - V_B) ; énergie potentielle E_pe = q · V + Cte ; champ uniforme E = U / d.</li>
            <li>Analyser les transferts d'énergie dans un circuit : énergie électrique W = U · I · Δt ; effet Joule W_J = R · I² · Δt ; rendements des générateurs et récepteurs.</li>
            <li>Caractériser le champ magnétique B (Tesla) : sources, lignes de champ (aimants, fil rectiligne B = μ₀·I/(2πr), bobine plate, solénoïde B = μ₀·n·I).</li>
            <li>Maîtriser la force de Laplace : F = I · (L × B) d'intensité F = I · L · B · sin(α) ; principe du moteur à courant continu et du haut-parleur.</li>
            <li>Optique géométrique : lois de Descartes ; miroirs plans ; lentilles minces convergentes : relation de conjugaison 1/OA' - 1/OA = 1/OF' et grandissement γ = A'B'/AB = OA'/OA.</li>
        </ul>
    </div>

    <table class="table-sheet">
        <thead>
            <tr>
                <th style="width: 28%;">Axes & Contenus du Cours</th>
                <th style="width: 24%;">Moyens & Matériel Didactique</th>
                <th style="width: 26%;">Activités d'Enseignement-Apprentissage</th>
                <th style="width: 22%;">Modalités d'Évaluation</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>
                    <strong>I. Champ Électrostatique & Énergie Potentielle</strong>
                    <ul>
                        <li>1. Force de Coulomb & vecteur champ E</li>
                        <li>2. Champ uniforme entre plaques parallèles E = U/d</li>
                        <li>3. Travail de la force W = q(V_A - V_B) & énergie potentielle</li>
                    </ul>
                    <strong>II. Transferts d'Énergie dans un Circuit</strong>
                    <ul>
                        <li>1. Puissance électrique P = U·I & effet Joule P_J = R·I²</li>
                        <li>2. Bilan énergétique & rendements de générateurs et récepteurs</li>
                    </ul>
                    <strong>III. Champ Magnétique & Force de Laplace</strong>
                    <ul>
                        <li>1. Vecteur champ magnétique B & lignes de champ</li>
                        <li>2. Champ créé par fil rectiligne, bobine plate et solénoïde</li>
                        <li>3. Force de Laplace F = I·L·B·sin(α) & moteur à courant continu</li>
                    </ul>
                    <strong>IV. Optique Géométrique & Lentilles</strong>
                    <ul>
                        <li>1. Images données par un miroir plan (virtuelle, symétrique)</li>
                        <li>2. Lentille convergente : distance focale f' = OF', vergence C = 1/f'</li>
                        <li>3. Formule de conjugaison de Descartes : 1/OA' - 1/OA = 1/f' & grandissement γ</li>
                    </ul>
                </td>
                <td>
                    <ul>
                        <li>Alimentation haute tension continue & condensateur plan</li>
                        <li>Pendule électrostatique & grains de semoule dans l'huile</li>
                        <li>Teslamètre numérique avec sondes axiale et tangentielle</li>
                        <li>Solénoïde d'étude, bobines plates & rails de Laplace</li>
                        <li>Aimant en U puissant & conducteur mobile sur rails</li>
                        <li>Banc d'optique gradué avec lentilles (+5, +10, +20 δ), objet lumineux et écran</li>
                        <li>Miroirs plans, boîte à rayons laser & disque gradué</li>
                    </ul>
                </td>
                <td>
                    <strong>Activité de l'Enseignant :</strong>
                    <ul>
                        <li>Visualiser le spectre du champ électrostatique dans l'huile.</li>
                        <li>Cartographier le champ magnétique d'un solénoïde en fonction de I et n.</li>
                        <li>Guider la formation d'images nettes sur écran et valider les lois de conjugaison.</li>
                    </ul>
                    <strong>Activité de l'Apprenant :</strong>
                    <ul>
                        <li>Mesurer B au centre d'un solénoïde et vérifier la relation B = μ₀·n·I.</li>
                        <li>Appliquer la règle de la main droite pour déterminer le sens de la force de Laplace.</li>
                        <li>Construire géométriquement les rayons lumineux et calculer le grandissement γ.</li>
                    </ul>
                </td>
                <td>
                    <strong>Diagnostique :</strong>
                    <ul>
                        <li>Rappel des lois des circuits et des pôles magnétiques.</li>
                    </ul>
                    <strong>Formative :</strong>
                    <ul>
                        <li>Résolution d'exercices d'optique et de calculs de vergence.</li>
                    </ul>
                    <strong>Sommative :</strong>
                    <ul>
                        <li>Contrôles surveillés complets sur l'électromagnétisme et l'optique.</li>
                    </ul>
                </td>
            </tr>
        </tbody>
    </table>
</div>

<!-- ================= 1BAC CHIMIE FR ================= -->

<div class="unit-container">
    <div class="unit-header-box">
        <div class="unit-part-tag">Composante Chimie • Semestre 1 & 2 • (Total : 41 Heures)</div>
        <div class="unit-title">Mesure en Chimie, Conductimétrie, Dosages Redox et Chimie Organique</div>
        <div class="unit-meta-bar">
            <span><strong>Durée :</strong> 41 Heures</span>
            <span><strong>Filières :</strong> 1BAC Sciences Expérimentales & Sciences Mathématiques</span>
        </div>
    </div>

    <div class="grid-two-col">
        <div class="info-card">
            <h4>📋 Prérequis Pédagogiques</h4>
            <ul>
                <li>La mole, masse molaire et concentration molaire C = n / V.</li>
                <li>Loi des gaz parfaits P·V = n·R·T et tableau d'avancement.</li>
                <li>Solutions électrolytiques et solvatation des ions dans l'eau.</li>
            </ul>
        </div>
        <div class="info-card accent">
            <h4>❓ Situation-Problème & Questionnements</h4>
            <p>La conductimétrie mesure la pureté des eaux par la migration des ions, tandis que les dosages d'oxydoréduction déterminent la teneur en principes actifs. En chimie organique, le raffinage produit carburants et plastiques. Comment les groupes caractéristiques gouvernent-ils la réactivité ?</p>
        </div>
    </div>

    <div class="info-card" style="margin-bottom: 12px;">
        <h4>🎯 Compétences Visées & Objectifs d'Apprentissage</h4>
        <ul>
            <li>Définir la conductance G = 1/R = I/U et la conductivité σ = G · (l/S) ; loi de Kohlrausch : σ = Σ λ_i · [X_i] ; exploiter la courbe d'étalonnage conductimétrique.</li>
            <li>Réactions acido-basiques de Brønsted : couples acide-base conjugués HA/A⁻ ; espèces amphotères (H₂O).</li>
            <li>Réactions d'oxydoréduction : oxydant (Ox), réducteur (Red), transferts d'électrons et équilibrage en milieu acide.</li>
            <li>Dosages directs (pH-métrique, conductimétrique, colorimétrique) : écrire l'équation de titrage, repérer l'équivalence et calculer la concentration inconnue C_A = C_B · V_BE / V_A.</li>
            <li>Chimie organique : squelettes carbonés linéaires, ramifiés et cycliques ; alcanes, alcènes et nomenclature officielle IUPAC ; isomérie de constitution et stéréoisomérie (Z/E).</li>
            <li>Modification du squelette carboné : craquage catalytique, reformage et polymérisation ; oxydation ménagée des alcools primaires, secondaires et tertiaires par KMnO₄ acidifié.</li>
        </ul>
    </div>

    <table class="table-sheet">
        <thead>
            <tr>
                <th style="width: 28%;">Axes & Contenus du Cours</th>
                <th style="width: 24%;">Moyens & Matériel Didactique</th>
                <th style="width: 26%;">Activités d'Enseignement-Apprentissage</th>
                <th style="width: 22%;">Modalités d'Évaluation</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>
                    <strong>I. Conductance & Conductimétrie</strong>
                    <ul>
                        <li>1. Conductance G = I/U (Siemens) & constante de cellule K = S/l</li>
                        <li>2. Conductivité σ = K·G & loi de Kohlrausch σ = Σ λ_i·[X_i]</li>
                        <li>3. Dosage par étalonnage conductimétrique</li>
                    </ul>
                    <strong>II. Réactions Acido-Basiques & Redox</strong>
                    <ul>
                        <li>1. Transfert de protons dans les couples HA/A⁻</li>
                        <li>2. Transfert d'électrons dans les couples Ox/Red</li>
                        <li>3. Équilibrage des demi-équations en milieu acide</li>
                    </ul>
                    <strong>III. Les Dosages Directs</strong>
                    <ul>
                        <li>1. Condition d'équivalence : proportions stœchiométriques n_A/a = n_B/b</li>
                        <li>2. Dosages colorimétrique et conductimétrique (courbes de titrage)</li>
                    </ul>
                    <strong>IV. Chimie Organique & Alcools</strong>
                    <ul>
                        <li>1. Squelettes carbonés : nomenclature IUPAC des alcanes et alcènes</li>
                        <li>2. Craquage catalytique & polymérisation d'addition</li>
                        <li>3. Classes d'alcools (1°, 2°, 3°) & oxydation ménagée (aldéhydes, cétones, acides)</li>
                    </ul>
                </td>
                <td>
                    <ul>
                        <li>Conductimètre numérique avec cellule étalonnée (KCl)</li>
                        <li>Burettes graduées (25 mL), pipettes jaugées, agitateurs magnétiques</li>
                        <li>Solutions titrées : KMnO₄, sel de Mohr, HCl, NaOH, I₂, Na₂S₂O₃</li>
                        <li>Alcools purs : Butan-1-ol, butan-2-ol, 2-méthylpropan-2-ol</li>
                        <li>Réactifs de caractérisation : 2,4-DNPH, liqueur de Fehling, réactif de Tollens</li>
                        <li>Modèles moléculaires et verrerie standard de chimie organique</li>
                    </ul>
                </td>
                <td>
                    <strong>Activité de l'Enseignant :</strong>
                    <ul>
                        <li>Conduire le dosage conductimétrique et expliquer le changement de pente à l'équivalence.</li>
                        <li>Guider le dosage manganimétrique des ions fer(II).</li>
                        <li>Encadrer les tests d'oxydation ménagée des alcools et les tests d'identification.</li>
                    </ul>
                    <strong>Activité de l'Apprenant :</strong>
                    <ul>
                        <li>Tracer la courbe de titrage conductimétrique et relever le volume équivalent V_E.</li>
                        <li>Équilibrer les réactions d'oxydoréduction selon la méthode méthodique.</li>
                        <li>Nommer les molécules organiques selon l'IUPAC et identifier les produits d'oxydation.</li>
                    </ul>
                </td>
                <td>
                    <strong>Diagnostique :</strong>
                    <ul>
                        <li>Test de rappel sur la mole et la stœchiométrie des réactions.</li>
                    </ul>
                    <strong>Formative :</strong>
                    <ul>
                        <li>Exercices de calcul de concentration à l'équivalence et de nomenclature.</li>
                    </ul>
                    <strong>Sommative :</strong>
                    <ul>
                        <li>Épreuves d'évaluation surveillées types Baccalauréat en chimie des solutions et organique.</li>
                    </ul>
                </td>
            </tr>
        </tbody>
    </table>
</div>

</body>
</html>"""

def main():
    out_dir = "/home/ubuntu/projects/codshop/pdf_translations"
    os.makedirs(out_dir, exist_ok=True)

    files_to_generate = [
        ("TC_Physics_Chemistry_Lesson_Plans_English", get_tc_english_html),
        ("TC_Physique_Chimie_Fiches_Pedagogiques_Francais", get_tc_french_html),
        ("1BAC_Physics_Chemistry_Lesson_Plans_English", get_1bac_english_html),
        ("1BAC_Physique_Chimie_Fiches_Pedagogiques_Francais", get_1bac_french_html),
    ]

    for basename, html_func in files_to_generate:
        html_path = os.path.join(out_dir, f"{basename}.html")
        pdf_path = os.path.join(out_dir, f"{basename}.pdf")

        print(f"Writing {html_path}...")
        with open(html_path, "w", encoding="utf-8") as f:
            f.write(html_func())

        print(f"Compiling {pdf_path} with Chromium...")
        cmd = [
            "/snap/bin/chromium",
            "--headless=new",
            "--disable-gpu",
            "--no-sandbox",
            f"--print-to-pdf={pdf_path}",
            f"file://{html_path}"
        ]
        subprocess.run(cmd, check=True)
        print(f"Generated {pdf_path}: {os.path.getsize(pdf_path)} bytes")

if __name__ == "__main__":
    main()
