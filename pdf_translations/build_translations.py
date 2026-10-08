# -*- coding: utf-8 -*-
"""
Generator for English and French translations of 2BAC Physics and Chemistry Lesson Plans (Fiches Pédagogiques / جذاذات تربوية)
Author: Ahmed El Bouziani (Second Year Baccalaureate Sciences - Moroccan Curriculum)
"""

import os
import subprocess

CSS_TEMPLATE = """
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

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
    display: flex;
    align-items: center;
    gap: 6px;
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

.badge {
    display: inline-block;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 7.5pt;
    font-weight: 600;
}

.badge-blue { background: #e0f2fe; color: #0369a1; }
.badge-amber { background: #fef3c7; color: #92400e; }
.badge-green { background: #dcfce7; color: #166534; }
"""

def generate_english_html():
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>2BAC Physics & Chemistry - Curriculum Pedagogical Sheets</title>
<style>{CSS_TEMPLATE}</style>
</head>
<body>

<!-- Cover Page -->
<div class="cover-page">
    <div class="cover-badge">Kingdom of Morocco • Secondary Education</div>
    <div class="cover-title">Pedagogical Lesson Plans</div>
    <div class="cover-subtitle">Physics & Chemistry (2nd Year Baccalaureate - Sciences)</div>
    <div style="font-size: 12pt; color: #475569; max-width: 500px; margin: 0 auto 30px auto;">
        Experimental Sciences (Physics-Chemistry, Life & Earth Sciences, Agricultural Sciences) & Mathematical Sciences (A & B)
    </div>
    <div class="cover-author">
        <strong>Prepared by:</strong> Professor AYOUB KHAMMOUR<br>
        <span style="font-size: 10.5pt; color: #64748b;">Registration No: 1503811</span>
    </div>
    <div class="cover-meta">
        Official Reference: National Educational Orientations • Ministerial Memos 09-142 & 144 • Approved Textbooks
    </div>
</div>

<!-- ================= PART 1: WAVES ================= -->

<!-- Physics Unit 1 -->
<div class="unit-container">
    <div class="unit-header-box">
        <div class="unit-part-tag">Physics Component • Part 1: Waves (Total: 15 - 16 Hours)</div>
        <div class="unit-title">Unit 1: Progressive Mechanical Waves</div>
        <div class="unit-meta-bar">
            <span><strong>Duration:</strong> 5 Hours</span>
            <span><strong>Streams:</strong> PC, SVT, Math A & B, Agronomy</span>
        </div>
    </div>

    <div class="grid-two-col">
        <div class="info-card">
            <h4>📋 Prerequisites</h4>
            <ul>
                <li>Relation between distance, speed, and elapsed time (v = d / t).</li>
                <li>Voltage measurements and time-base readings using an oscilloscope.</li>
                <li>Mechanical energy of a solid body (kinetic and potential energy).</li>
            </ul>
        </div>
        <div class="info-card accent">
            <h4>❓ Guiding Problem Situation</h4>
            <p>The propagation of a disturbance causes local, temporary alterations in one or more physical properties of a medium. What defines this phenomenon? What are its primary classifications, general properties, and practical applications?</p>
        </div>
    </div>

    <div class="info-card" style="margin-bottom: 12px;">
        <h4>🎯 Targeted Competencies & Learning Objectives</h4>
        <ul>
            <li>Distinguish 1D, 2D, and 3D mechanical waves.</li>
            <li>Define a mechanical wave and distinguish between transverse and longitudinal waves.</li>
            <li>Apply general wave properties: propagation direction, independence of crossing waves, and non-transport of matter.</li>
            <li>Determine propagation velocity (v = d / Δt), identify affecting factors (medium elasticity, inertia, tension), and compute temporal delay (τ = d / v).</li>
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
                    <strong>I. Examples of Mechanical Waves</strong>
                    <ul>
                        <li>1. Transverse wave (rope, water surface)</li>
                        <li>2. Longitudinal wave (spring, sound in air)</li>
                    </ul>
                    <strong>II. Properties of Progressive Waves</strong>
                    <ul>
                        <li>1. Definition of disturbance & wave</li>
                        <li>2. Propagation direction & dimensionality</li>
                        <li>3. Wave velocity & influencing factors</li>
                    </ul>
                    <strong>III. 1D Progressive Wave & Time Delay</strong>
                    <ul>
                        <li>1. Time delay τ = SM / v</li>
                        <li>2. Motion relation: y_M(t) = y_S(t - τ)</li>
                    </ul>
                </td>
                <td>
                    <ul>
                        <li>Student textbook & whiteboard</li>
                        <li>Computer & video projector</li>
                        <li>Coiled spring & mounting stands</li>
                        <li>Ropes of varied linear mass</li>
                        <li>Wave ripple tank & accessories</li>
                        <li>Tuning fork & vacuum bell jar</li>
                        <li>Oscilloscope, 2 microphones & cables</li>
                        <li>Photocells & digital chronometer</li>
                    </ul>
                </td>
                <td>
                    <strong>Teacher:</strong>
                    <ul>
                        <li>Prompt prior knowledge via targeted questions.</li>
                        <li>Perform live demonstrations (stretched rope, compression spring, wave tank).</li>
                        <li>Formalize definitions, formulas, and units.</li>
                    </ul>
                    <strong>Student:</strong>
                    <ul>
                        <li>Observe and classify wave types.</li>
                        <li>Process experimental data and compute wave velocity and time delay.</li>
                    </ul>
                </td>
                <td>
                    <strong>Diagnostic:</strong>
                    <ul>
                        <li>Oral questions on speed formula and units.</li>
                    </ul>
                    <strong>Formative:</strong>
                    <ul>
                        <li>Analysis of oscilloscope graphs and chronophotography.</li>
                    </ul>
                    <strong>Summative:</strong>
                    <ul>
                        <li>Structured problem exercises & Supervised Exam 1.</li>
                    </ul>
                </td>
            </tr>
        </tbody>
    </table>
</div>

<!-- Physics Unit 2 -->
<div class="unit-container">
    <div class="unit-header-box">
        <div class="unit-part-tag">Physics Component • Part 1: Waves</div>
        <div class="unit-title">Unit 2: Periodic Mechanical Waves</div>
        <div class="unit-meta-bar">
            <span><strong>Duration:</strong> 5 Hours</span>
            <span><strong>Streams:</strong> PC, SVT, Math A & B</span>
        </div>
    </div>

    <div class="grid-two-col">
        <div class="info-card">
            <h4>📋 Prerequisites</h4>
            <ul>
                <li>Concept of progressive mechanical wave and classifications.</li>
                <li>Wave velocity, distance, and time delay relationship.</li>
                <li>Oscilloscope and computer data acquisition usage.</li>
            </ul>
        </div>
        <div class="info-card accent">
            <h4>❓ Guiding Problem Situation</h4>
            <p>Ocean swells traveling toward the coast act as sinusoidal progressive waves. What defines periodic sinusoidal waves? What happens when a surface water wave encounters a narrow slit? What conditions govern wave diffraction?</p>
        </div>
    </div>

    <div class="info-card" style="margin-bottom: 12px;">
        <h4>🎯 Targeted Competencies & Learning Objectives</h4>
        <ul>
            <li>Understand periodic and sinusoidal mechanical progressive waves.</li>
            <li>Identify double periodicity: temporal period T (and frequency N = 1/T) and spatial period (wavelength λ).</li>
            <li>Master fundamental wave relationship: λ = v · T = v / N.</li>
            <li>Observe and characterize mechanical wave diffraction and recognize when diffraction occurs (slit width a ≤ λ).</li>
            <li>Understand dispersive media where wave velocity depends on frequency.</li>
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
                    <strong>I. Periodic Progressive Waves</strong>
                    <ul>
                        <li>1. Definition & characteristics</li>
                        <li>2. Propagation velocity</li>
                        <li>3. Stroboscopic observation (apparent immobility)</li>
                    </ul>
                    <strong>II. Sinusoidal Progressive Waves</strong>
                    <ul>
                        <li>1. Wave along a string</li>
                        <li>2. Surface water waves (circular & plane)</li>
                        <li>3. Sound and ultrasonic waves</li>
                    </ul>
                    <strong>III. Mechanical Wave Diffraction</strong>
                    <ul>
                        <li>1. Experimental setup with slit barrier</li>
                        <li>2. Condition of diffraction (a ≤ λ)</li>
                        <li>3. Sound wave diffraction</li>
                    </ul>
                    <strong>IV. Dispersive Medium</strong>
                    <ul>
                        <li>1. Frequency variation & velocity analysis</li>
                        <li>2. Definition of dispersive medium</li>
                    </ul>
                </td>
                <td>
                    <ul>
                        <li>Ripple tank with vibrator & plane/point dippers</li>
                        <li>Stroboscope & frequency generator (GBF)</li>
                        <li>Vibrating blade & cork floaters</li>
                        <li>Loudspeaker & 2 sound sensors / mics</li>
                        <li>Dual-channel oscilloscope & cables</li>
                        <li>Adjustable slit diaphragms</li>
                        <li>Simulation software (Avimeca / Regressi)</li>
                    </ul>
                </td>
                <td>
                    <strong>Teacher:</strong>
                    <ul>
                        <li>Demonstrate stroboscopic immobilization of waves.</li>
                        <li>Guide measurement of wavelength λ on ripple tank and oscilloscope.</li>
                        <li>Demonstrate diffraction through adjustable barriers.</li>
                    </ul>
                    <strong>Student:</strong>
                    <ul>
                        <li>Determine frequency N and wavelength λ.</li>
                        <li>Deduce wave speed v = λ · N and verify dispersion.</li>
                    </ul>
                </td>
                <td>
                    <strong>Diagnostic:</strong>
                    <ul>
                        <li>Questions on wave period, frequency, and units.</li>
                    </ul>
                    <strong>Formative:</strong>
                    <ul>
                        <li>Oscilloscope phase-matching exercises.</li>
                    </ul>
                    <strong>Summative:</strong>
                    <ul>
                        <li>Exam questions on diffraction limits and dispersive media.</li>
                    </ul>
                </td>
            </tr>
        </tbody>
    </table>
</div>

<!-- Physics Unit 3 -->
<div class="unit-container">
    <div class="unit-header-box">
        <div class="unit-part-tag">Physics Component • Part 1: Waves</div>
        <div class="unit-title">Unit 3: Propagation of a Light Wave</div>
        <div class="unit-meta-bar">
            <span><strong>Duration:</strong> 5 - 6 Hours</span>
            <span><strong>Streams:</strong> PC, SVT, Math A & B</span>
        </div>
    </div>

    <div class="grid-two-col">
        <div class="info-card">
            <h4>📋 Prerequisites</h4>
            <ul>
                <li>Mechanical wave diffraction phenomenon.</li>
                <li>Wave equation: λ = v · T = v / ν.</li>
                <li>Concept of transparent dispersive medium and Snell-Descartes laws.</li>
            </ul>
        </div>
        <div class="info-card accent">
            <h4>❓ Guiding Problem Situation</h4>
            <p>Laser beams are widely used in medicine, surgery, and precision manufacturing. How does laser light reveal the wave nature of light, and how is diffraction exploited to measure microscopic dimensions of hair or fibers with micron precision?</p>
        </div>
    </div>

    <div class="info-card" style="margin-bottom: 12px;">
        <h4>🎯 Targeted Competencies & Learning Objectives</h4>
        <ul>
            <li>Demonstrate the wave nature of light through diffraction phenomena.</li>
            <li>Master diffraction angle formula: θ = λ / a and geometric relation tan(θ) ≈ L / (2D).</li>
            <li>Distinguish monochromatic light (single frequency) from polychromatic light.</li>
            <li>Understand light dispersion through prisms and verify that frequency ν is invariant across media.</li>
            <li>Calculate refractive index n = c / v (where n > 1) and apply prism formulas.</li>
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
                    <strong>I. Light Diffraction</strong>
                    <ul>
                        <li>1. Diffraction phenomenon & wave model</li>
                        <li>2. Diffraction by a thin slit or hair</li>
                        <li>3. Angular half-width θ = λ / a</li>
                        <li>4. Determination of slit width a = 2λD / L</li>
                    </ul>
                    <strong>II. Dispersion of Light</strong>
                    <ul>
                        <li>1. Refractive index n = c / v</li>
                        <li>2. Dispersion of white light by a glass prism</li>
                        <li>3. Snell-Descartes refraction laws & prism equations:
                            sin(i) = n·sin(r), sin(i') = n·sin(r'), A = r + r', D = i + i' - A</li>
                    </ul>
                </td>
                <td>
                    <ul>
                        <li>Monochromatic red laser (λ ≈ 650 nm) & green laser</li>
                        <li>Calibrated slits, pinholes, and thin wire mounts</li>
                        <li>Projection screen & metric measuring tape</li>
                        <li>Glass/acrylic triangular prism & goniometer</li>
                        <li>White light source & condensing lens</li>
                        <li>Newton optical color disc with motor</li>
                        <li>Optics simulation applets</li>
                    </ul>
                </td>
                <td>
                    <strong>Teacher:</strong>
                    <ul>
                        <li>Direct laser diffraction setup and enforce eye safety.</li>
                        <li>Guide students to plot θ vs 1/a curve.</li>
                        <li>Demonstrate prism white light dispersion into spectrum.</li>
                    </ul>
                    <strong>Student:</strong>
                    <ul>
                        <li>Measure central fringe width L as a function of slit size a and distance D.</li>
                        <li>Calculate laser wavelength λ from linear regression slope.</li>
                    </ul>
                </td>
                <td>
                    <strong>Diagnostic:</strong>
                    <ul>
                        <li>Check geometric optics prerequisites (rectilinear propagation, refraction).</li>
                    </ul>
                    <strong>Formative:</strong>
                    <ul>
                        <li>Slope calculation and error estimation on diffraction graphs.</li>
                    </ul>
                    <strong>Summative:</strong>
                    <ul>
                        <li>National Baccalaureate exam problems on light waves.</li>
                    </ul>
                </td>
            </tr>
        </tbody>
    </table>
</div>

<!-- ================= PART 2: NUCLEAR TRANSFORMATIONS ================= -->

<!-- Physics Unit 4 & 5 -->
<div class="unit-container">
    <div class="unit-header-box">
        <div class="unit-part-tag">Physics Component • Part 2: Nuclear Transformations (Total: 10 - 14 Hours)</div>
        <div class="unit-title">Unit 1: Radioactive Decay & Unit 2: Mass, Energy and Nuclei</div>
        <div class="unit-meta-bar">
            <span><strong>Duration:</strong> 10 - 14 Hours</span>
            <span><strong>Streams:</strong> PC, SVT, Math A & B</span>
        </div>
    </div>

    <div class="grid-two-col">
        <div class="info-card">
            <h4>📋 Prerequisites</h4>
            <ul>
                <li>Atomic structure: protons (Z), neutrons (N), nucleons (A).</li>
                <li>Isotopes definition and chemical neutrality of atoms.</li>
                <li>Conservation of mass-energy and elementary charges.</li>
            </ul>
        </div>
        <div class="info-card accent">
            <h4>❓ Guiding Problem Situation</h4>
            <p>Carbon-14 dating determines the age of archaeological relics, while Uranium-235 fission delivers massive energy in power reactors. What physical laws govern spontaneous radioactive decay, mass defect, and binding energy?</p>
        </div>
    </div>

    <div class="info-card" style="margin-bottom: 12px;">
        <h4>🎯 Targeted Competencies & Learning Objectives</h4>
        <ul>
            <li>Interpret nuclide representation ^A_Z X and analyze the Segrè chart (N vs Z stability valley).</li>
            <li>Apply Soddy's conservation laws for nucleon number A and charge number Z to write balanced nuclear decay equations (α, β⁻, β⁺, γ).</li>
            <li>Utilize radioactive decay law: N(t) = N₀ · e^(-λt) and relate half-life to decay constant: t_(1/2) = ln(2) / λ = τ · ln(2).</li>
            <li>Define radioactivity A(t) = -dN/dt = λ·N(t) in Becquerels (Bq) and solve radioactive dating problems.</li>
            <li>Calculate mass defect Δm = [Z·m_p + (A-Z)·m_n] - m(nucleus) and binding energy E_l = Δm · c².</li>
            <li>Analyze the Aston curve (-E_l / A vs A) to explain nuclear fission and nuclear fusion.</li>
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
                    <strong>Part 1: Radioactive Decay</strong>
                    <ul>
                        <li>1. Nuclear stability & Segrè diagram</li>
                        <li>2. Spontaneous decay types: α, β⁻, β⁺, and γ de-excitation</li>
                        <li>3. Soddy's conservation rules</li>
                        <li>4. Decay law N(t), half-life t_(1/2), activity A(t)</li>
                        <li>5. Carbon-14 and rock dating principles</li>
                    </ul>
                    <strong>Part 2: Mass, Energy & Nuclear Reactions</strong>
                    <ul>
                        <li>1. Mass-energy equivalence: E = m·c²</li>
                        <li>2. Mass defect Δm and binding energy E_l</li>
                        <li>3. Binding energy per nucleon E_l / A</li>
                        <li>4. Aston curve, fission of U-235, and fusion of H isotopes</li>
                        <li>5. Energy balance of nuclear reactions: ΔE = [Σm_products - Σm_reactants]·c²</li>
                    </ul>
                </td>
                <td>
                    <ul>
                        <li>Geiger-Müller counter & ambient background monitor</li>
                        <li>Segrè chart (N vs Z) printouts / software viewer</li>
                        <li>Aston curve reference chart</li>
                        <li>Decay simulation programs (dice model / computer applets)</li>
                        <li>Scientific calculator & atomic mass tables (in u and MeV/c²)</li>
                        <li>Interactive video documentaries on nuclear power plants</li>
                    </ul>
                </td>
                <td>
                    <strong>Teacher:</strong>
                    <ul>
                        <li>Introduce radioactive decay through dice rolling analogy and exponential regression.</li>
                        <li>Demonstrate balancing nuclear equations via Soddy's laws.</li>
                        <li>Guide calculation of released energy E_lib = |ΔE|.</li>
                    </ul>
                    <strong>Student:</strong>
                    <ul>
                        <li>Balance α, β⁻, β⁺ nuclear reactions.</li>
                        <li>Calculate radioactive age of fossil samples.</li>
                        <li>Compute mass defect in atomic mass units (u) and convert to MeV.</li>
                    </ul>
                </td>
                <td>
                    <strong>Diagnostic:</strong>
                    <ul>
                        <li>Nuclear structure recall test.</li>
                    </ul>
                    <strong>Formative:</strong>
                    <ul>
                        <li>Half-life graph reading and logarithmic linearization ln(N) vs t.</li>
                    </ul>
                    <strong>Summative:</strong>
                    <ul>
                        <li>Supervised Exam 2 problems on nuclear energy and dating.</li>
                    </ul>
                </td>
            </tr>
        </tbody>
    </table>
</div>

<!-- ================= PART 3: ELECTRICITY ================= -->

<!-- Physics Unit 6, 7 & 8 -->
<div class="unit-container">
    <div class="unit-header-box">
        <div class="unit-part-tag">Physics Component • Part 3: Electricity (Total: 22 - 38 Hours)</div>
        <div class="unit-title">Units 1, 2 & 3: RC Dipole, RL Dipole, and Free RLC Oscillations</div>
        <div class="unit-meta-bar">
            <span><strong>Duration:</strong> 22 - 38 Hours</span>
            <span><strong>Streams:</strong> PC, SVT, Math A & B</span>
        </div>
    </div>

    <div class="grid-two-col">
        <div class="info-card">
            <h4>📋 Prerequisites</h4>
            <ul>
                <li>Nature of electric current in metallic conductors.</li>
                <li>Kirchhoff's laws: Node rule (currents) & Mesh rule (voltages).</li>
                <li>Ohm's law for resistors and oscilloscope differential measurements.</li>
            </ul>
        </div>
        <div class="info-card accent">
            <h4>❓ Guiding Problem Situation</h4>
            <p>Camera flash units store electrical energy in capacitors for instant release, while coils oppose sudden changes in current. How do RC, RL, and RLC circuits react to voltage steps, and how are sustained electrical oscillations maintained?</p>
        </div>
    </div>

    <div class="info-card" style="margin-bottom: 12px;">
        <h4>🎯 Targeted Competencies & Learning Objectives</h4>
        <ul>
            <li>Establish and solve differential equations for RC dipole charge/discharge: u_C(t) + RC · (du_C/dt) = E.</li>
            <li>Determine RC time constant τ = RC graphically (tangent at origin, 63% rule) and calculate electrostatic energy E_e = 0.5·C·u_C².</li>
            <li>Establish differential equation for RL dipole current setup: u_L + Ri = E with u_L = L(di/dt) + ri, find τ = L / (R + r), and magnetic energy E_m = 0.5·L·i².</li>
            <li>Study series RLC oscillations: identify regimes (pseudoperiodic, aperiodic, critical), calculate natural period T₀ = 2π√(LC), analyze energy dissipation by Joule effect, and understand oscillation maintenance.</li>
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
                    <strong>I. RC Dipole</strong>
                    <ul>
                        <li>1. Capacitor definition, capacitance C, q = C·u_C</li>
                        <li>2. Response to voltage step: charge & discharge</li>
                        <li>3. Differential equation & analytical solution</li>
                        <li>4. Time constant τ = RC & stored energy E_e = 0.5 C u_C²</li>
                    </ul>
                    <strong>II. RL Dipole</strong>
                    <ul>
                        <li>1. Coil inductance L, internal resistance r, u_L = L(di/dt) + ri</li>
                        <li>2. Current establishment & break</li>
                        <li>3. Time constant τ = L / (R_total) & magnetic energy E_m = 0.5 L i²</li>
                    </ul>
                    <strong>III. Series RLC Circuit</strong>
                    <ul>
                        <li>1. Free damped oscillations (pseudoperiod T ≈ T₀)</li>
                        <li>2. Undamped LC circuit & differential equation: d²u_C/dt² + (1/LC)u_C = 0</li>
                        <li>3. Total energy exchange: E_T = E_e + E_m & damping</li>
                        <li>4. Active maintenance using negative conductance circuit</li>
                    </ul>
                </td>
                <td>
                    <ul>
                        <li>Regulated DC power supply & square-wave generator (GBF)</li>
                        <li>Capacitor decade boxes (0.1 µF - 100 µF)</li>
                        <li>Variable decade resistors (10 Ω - 10 kΩ)</li>
                        <li>Inductor coils with laminated iron core (L = 0.1 H - 1 H)</li>
                        <li>Digital storage oscilloscope / computer interface</li>
                        <li>Operational amplifier (Op-Amp) for oscillation maintenance</li>
                    </ul>
                </td>
                <td>
                    <strong>Teacher:</strong>
                    <ul>
                        <li>Supervise circuit wiring and verify ground isolation.</li>
                        <li>Guide oscilloscope capture of transient curves u_C(t) and u_R(t).</li>
                        <li>Demonstrate analytical derivation of differential equations.</li>
                    </ul>
                    <strong>Student:</strong>
                    <ul>
                        <li>Assemble RC, RL, and RLC circuits following schematics.</li>
                        <li>Determine time constants τ from experimental curves.</li>
                        <li>Verify natural period formula T₀ = 2π√(LC).</li>
                    </ul>
                </td>
                <td>
                    <strong>Diagnostic:</strong>
                    <ul>
                        <li>Ohm's law and Kirchhoff's laws verification quiz.</li>
                    </ul>
                    <strong>Formative:</strong>
                    <ul>
                        <li>Differential equation derivation test and unit analysis of τ.</li>
                    </ul>
                    <strong>Summative:</strong>
                    <ul>
                        <li>Comprehensive Supervised Exam on transient electrical circuits.</li>
                    </ul>
                </td>
            </tr>
        </tbody>
    </table>
</div>

<!-- ================= PART 4: MECHANICS ================= -->

<!-- Physics Unit 9, 10, 11 & 12 -->
<div class="unit-container">
    <div class="unit-header-box">
        <div class="unit-part-tag">Physics Component • Part 4: Classical Mechanics (Total: 35 - 47 Hours)</div>
        <div class="unit-title">Newton's Laws, Projectiles, Satellites and Mechanical Oscillators</div>
        <div class="unit-meta-bar">
            <span><strong>Duration:</strong> 35 - 47 Hours</span>
            <span><strong>Streams:</strong> PC, SVT, Math A & B</span>
        </div>
    </div>

    <div class="grid-two-col">
        <div class="info-card">
            <h4>📋 Prerequisites</h4>
            <ul>
                <li>Velocity and acceleration vectors; Cartesian and Frenet coordinate frames.</li>
                <li>Equilibrium of a rigid solid body and contact/friction forces.</li>
                <li>Work of a constant force, kinetic energy theorem, and mechanical energy conservation.</li>
            </ul>
        </div>
        <div class="info-card accent">
            <h4>❓ Guiding Problem Situation</h4>
            <p>From soccer ball trajectories to satellite orbits around Earth and mechanical clocks, motion obeys universal principles. How do Newton's laws predict planar motions, orbital velocities, and oscillating system dynamics?</p>
        </div>
    </div>

    <div class="info-card" style="margin-bottom: 12px;">
        <h4>🎯 Targeted Competencies & Learning Objectives</h4>
        <ul>
            <li>Formulate Newton's three laws: Inertia principle (1st), Fundamental principle ΣF_ext = m·a_G (2nd), and Action-Reaction (3rd).</li>
            <li>Study vertical fall of a solid body: free fall vs vertical fall in viscous fluid with fluid friction force f = -k·v^n; solve differential equations via Euler's numerical method.</li>
            <li>Analyze projectile motion in uniform gravity field: establish parametric equations, trajectory equation y(x), maximum height (flèche), and range (portée).</li>
            <li>Master planetary & satellite motions (Kepler's laws, circular orbit velocity v = √(G·M/r), period T² / r³ = 4π² / (G·M), and geostationary condition).</li>
            <li>Examine mechanical harmonic oscillators (elastic spring-mass, torsion pendulum, simple pendulum): establish differential equations, determine natural period T₀, and analyze mechanical energy conservation.</li>
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
                    <strong>I. Newton's Laws & Linear Motion</strong>
                    <ul>
                        <li>1. Kinematics vectors (r, v, a) & Frenet frame</li>
                        <li>2. Newton's 2nd law ΣF = m·a_G</li>
                        <li>3. Motion on horizontal and inclined planes</li>
                    </ul>
                    <strong>II. Vertical Fall & Fluid Friction</strong>
                    <ul>
                        <li>1. Free fall: a = g, v(t) = g·t</li>
                        <li>2. Viscous fall: dv/dt = A - B·v; terminal velocity v_lim; Euler's method</li>
                    </ul>
                    <strong>III. Planar Projectile & Charged Particle Motions</strong>
                    <ul>
                        <li>1. Projectile equations: x(t) = (v₀·cosα)·t, y(t) = -0.5g·t² + (v₀·sinα)·t</li>
                        <li>2. Particle in magnetic field: Lorentz force F = q(v × B), circular trajectory R = m·v / (|q|·B)</li>
                    </ul>
                    <strong>IV. Planetary Motion & Kepler's Laws</strong>
                    <ul>
                        <li>Kepler's 3 laws, circular orbital speed & geostationary orbit</li>
                    </ul>
                    <strong>V. Mechanical Oscillators & Energy</strong>
                    <ul>
                        <li>Spring-mass system: m·x'' + k·x = 0; T₀ = 2π√(m/k)</li>
                        <li>Kinetic, potential, and mechanical energy conservation</li>
                    </ul>
                </td>
                <td>
                    <ul>
                        <li>Air cushion linear track with photogates & glider</li>
                        <li>Graduated cylinder filled with glycerol & steel bearing balls</li>
                        <li>Video recording camera & Avimeca motion tracking software</li>
                        <li>Helical springs of known stiffness k & slotted masses</li>
                        <li>Torsion pendulum apparatus & simple pendulum bench</li>
                        <li>Dynamic spreadsheet for Euler's method computation</li>
                    </ul>
                </td>
                <td>
                    <strong>Teacher:</strong>
                    <ul>
                        <li>Demonstrate Newton's 2nd law on linear air track.</li>
                        <li>Video-capture projectile launch and analyze coordinates with software.</li>
                        <li>Guide students through iterative steps of Euler's algorithm.</li>
                    </ul>
                    <strong>Student:</strong>
                    <ul>
                        <li>Derive theoretical trajectory equation and calculate impact range.</li>
                        <li>Plot velocity vs time for viscous fall and identify terminal velocity.</li>
                        <li>Measure pendulum oscillation periods and compare with T₀ formula.</li>
                    </ul>
                </td>
                <td>
                    <strong>Diagnostic:</strong>
                    <ul>
                        <li>Vectors, projection on axes, and derivative rules review.</li>
                    </ul>
                    <strong>Formative:</strong>
                    <ul>
                        <li>Differential equation setup and Euler table computation exercise.</li>
                    </ul>
                    <strong>Summative:</strong>
                    <ul>
                        <li>National Baccalaureate physics exam mechanical problems.</li>
                    </ul>
                </td>
            </tr>
        </tbody>
    </table>
</div>

<!-- ================= PART 5: CHEMISTRY ================= -->

<!-- Chemistry Unit 1 & 2 -->
<div class="unit-container">
    <div class="unit-header-box">
        <div class="unit-part-tag">Chemistry Component • Part 1: Fast & Slow Transformations (Total: 8 - 11 Hours)</div>
        <div class="unit-title">Units 1 & 2: Reaction Kinetics & Chemical Time Tracking</div>
        <div class="unit-meta-bar">
            <span><strong>Duration:</strong> 8 - 11 Hours</span>
            <span><strong>Streams:</strong> PC, SVT, Math A & B</span>
        </div>
    </div>

    <div class="grid-two-col">
        <div class="info-card">
            <h4>📋 Prerequisites</h4>
            <ul>
                <li>Oxidation-reduction concepts: oxidants, reductants, and redox electron transfer.</li>
                <li>Reaction progress x, ICE progress tables, and limiting reactant determination.</li>
                <li>Conductometry formulas (σ = Σ λ_i · [X_i]) and ideal gas law (P·V = n·R·T).</li>
            </ul>
        </div>
        <div class="info-card accent">
            <h4>❓ Guiding Problem Situation</h4>
            <p>Antique book pages slowly yellow over decades due to cellulose acid reactions, while gasoline combustion in car engines occurs in milliseconds. What distinguishes fast and slow reactions? How can chemists measure and control reaction rates over time?</p>
        </div>
    </div>

    <div class="info-card" style="margin-bottom: 12px;">
        <h4>🎯 Targeted Competencies & Learning Objectives</h4>
        <ul>
            <li>Distinguish fast reactions (instantaneous) from slow reactions (observable over seconds, minutes, or hours).</li>
            <li>Identify kinetic factors: reactant concentration, temperature, and catalysts.</li>
            <li>Master physical and chemical tracking methods: chemical titration, conductometry, spectrophotometry, and manometry.</li>
            <li>Define volumetric reaction rate: v = (1/V) · (dx/dt) and explain its decrease over time due to reactant consumption.</li>
            <li>Define reaction half-life t_(1/2) where x(t_(1/2)) = x_f / 2 and determine it graphically from progress curves.</li>
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
                    <strong>I. Oxidation-Reduction Recall</strong>
                    <ul>
                        <li>1. Redox couples Ox/Red & half-reactions</li>
                        <li>2. Balanced redox equations</li>
                    </ul>
                    <strong>II. Fast vs Slow Transformations</strong>
                    <ul>
                        <li>1. Instantaneous precipitation/acid-base reactions</li>
                        <li>2. Slow transformations (e.g. Iodide ions + Hydrogen peroxide)</li>
                    </ul>
                    <strong>III. Kinetic Factors</strong>
                    <ul>
                        <li>1. Influence of temperature (quenching & heating)</li>
                        <li>2. Influence of initial concentrations</li>
                        <li>3. Catalysts</li>
                    </ul>
                    <strong>IV. Time Tracking of Reactions</strong>
                    <ul>
                        <li>1. Tracking by chemical titration (quenching in ice water)</li>
                        <li>2. Tracking by conductometry & manometry</li>
                        <li>3. Volumetric reaction rate v = (1/V)·dx/dt (tangent slope)</li>
                        <li>4. Reaction half-life t_(1/2) definition & determination</li>
                    </ul>
                </td>
                <td>
                    <ul>
                        <li>Beakers, graduated cylinders, burettes, pipettes</li>
                        <li>Solutions: KI, H₂O₂, Na₂S₂O₃, starch indicator, HCl, Mg ribbon</li>
                        <li>Magnetic stirrers & temperature-controlled water bath</li>
                        <li>Conductometer & conductivity probe cell</li>
                        <li>Pressure sensor / digital manometer & sealed reaction flask</li>
                        <li>Stopwatch & ice-water bath for reaction quenching</li>
                    </ul>
                </td>
                <td>
                    <strong>Teacher:</strong>
                    <ul>
                        <li>Demonstrate slow reaction of I⁻ with H₂O₂ and show temperature effect.</li>
                        <li>Guide students through chemical quenching and titration of iodine.</li>
                        <li>Demonstrate graphical determination of reaction rate via curve tangents.</li>
                    </ul>
                    <strong>Student:</strong>
                    <ul>
                        <li>Construct ICE progress table and express progress x(t) from titration data.</li>
                        <li>Plot x(t) curve, trace tangent at t = 0 and t > 0, and compute reaction rates.</li>
                        <li>Extract half-life t_(1/2) from experimental graph.</li>
                    </ul>
                </td>
                <td>
                    <strong>Diagnostic:</strong>
                    <ul>
                        <li>Test on balancing redox equations and calculating moles n = C·V.</li>
                    </ul>
                    <strong>Formative:</strong>
                    <ul>
                        <li>Tangent slope calculation practice and error margins.</li>
                    </ul>
                    <strong>Summative:</strong>
                    <ul>
                        <li>National exam problems on reaction kinetics and conductometric tracking.</li>
                    </ul>
                </td>
            </tr>
        </tbody>
    </table>
</div>

<!-- Chemistry Unit 3 & 4 -->
<div class="unit-container">
    <div class="unit-header-box">
        <div class="unit-part-tag">Chemistry Component • Part 2: Non-Total Transformations (Total: 13 - 17 Hours)</div>
        <div class="unit-title">Reversible Reactions, Chemical Equilibrium & Acid-Base Solutions</div>
        <div class="unit-meta-bar">
            <span><strong>Duration:</strong> 13 - 17 Hours</span>
            <span><strong>Streams:</strong> PC, SVT, Math A & B</span>
        </div>
    </div>

    <div class="grid-two-col">
        <div class="info-card">
            <h4>📋 Prerequisites</h4>
            <ul>
                <li>Brønsted-Lowry definition of acids and bases (proton H⁺ transfer).</li>
                <li>Definition of pH for dilute solutions (pH = -log[H₃O⁺]).</li>
                <li>Conductivity of ionic solutions and ICE progress tables.</li>
            </ul>
        </div>
        <div class="info-card accent">
            <h4>❓ Guiding Problem Situation</h4>
            <p>In limestone caves, stalactites form through reversible calcium bicarbonate reactions. What characterizes reactions that do not reach 100% completion? How do chemists quantify chemical equilibrium and acid-base strength?</p>
        </div>
    </div>

    <div class="info-card" style="margin-bottom: 12px;">
        <h4>🎯 Targeted Competencies & Learning Objectives</h4>
        <ul>
            <li>Define final progress ratio τ = x_f / x_max and distinguish total reactions (τ = 1) from non-total equilibrium reactions (τ < 1).</li>
            <li>Express reaction quotient Q_r and equilibrium constant K; verify that K depends strictly on temperature.</li>
            <li>Master ionic product of water K_e = [H₃O⁺]·[HO⁻] = 10^(-14) at 25°C and acidity constant K_a of acid-base couples.</li>
            <li>Construct and interpret predominance diagrams using pH = pK_a + log([A⁻]/[HA]).</li>
            <li>Perform pH-metric titrations, identify equivalence point (tangent method & derivative dpH/dV), and select appropriate colored indicators.</li>
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
                    <strong>I. Non-Total Chemical Reactions</strong>
                    <ul>
                        <li>1. Final progress x_f vs theoretical maximum x_max</li>
                        <li>2. Final progress ratio τ = x_f / x_max</li>
                        <li>3. Microscopic interpretation of dynamic chemical equilibrium</li>
                    </ul>
                    <strong>II. Chemical Equilibrium State</strong>
                    <ul>
                        <li>1. Reaction quotient Q_r & equilibrium value Q_r,eq</li>
                        <li>2. Equilibrium constant K = Q_r,eq</li>
                        <li>3. Influence of initial concentration on τ</li>
                    </ul>
                    <strong>III. Acid-Base Reactions in Aqueous Medium</strong>
                    <ul>
                        <li>1. Auto-ionization of water K_e & neutral/acid/basic solutions</li>
                        <li>2. Acidity constant K_a, pK_a = -log(K_a), and pH relation</li>
                        <li>3. Predominance & distribution diagrams</li>
                        <li>4. pH-metric titration curves, equivalence point, and indicator choice</li>
                    </ul>
                </td>
                <td>
                    <ul>
                        <li>Calibrated digital pH-meter with buffer solutions (pH 4.00, 7.00, 10.00)</li>
                        <li>Solutions: Ethanoic acid, hydrochloric acid, sodium hydroxide (NaOH), methanoic acid</li>
                        <li>Graduated precision burette (25 mL) & volumetric pipettes</li>
                        <li>Magnetic stirrer & stirring bar</li>
                        <li>Colored indicators: Bromothymol blue, phenolphthalein, methyl orange</li>
                    </ul>
                </td>
                <td>
                    <strong>Teacher:</strong>
                    <ul>
                        <li>Supervise pH measurements and demonstrate buffer calibration.</li>
                        <li>Guide students to calculate τ for strong vs weak acids of identical concentration.</li>
                        <li>Demonstrate parallel tangent method to locate titration equivalence point.</li>
                    </ul>
                    <strong>Student:</strong>
                    <ul>
                        <li>Measure solution pH, calculate [H₃O⁺] and deduce x_f and τ.</li>
                        <li>Plot pH vs added volume V_b and determine equivalence volume V_bE.</li>
                        <li>Justify indicator selection based on indicator pK_In zone covering equivalence pH.</li>
                    </ul>
                </td>
                <td>
                    <strong>Diagnostic:</strong>
                    <ul>
                        <li>Quiz on acid-base formulas and pH scale.</li>
                    </ul>
                    <strong>Formative:</strong>
                    <ul>
                        <li>Equilibrium constant K calculation from ICE table.</li>
                    </ul>
                    <strong>Summative:</strong>
                    <ul>
                        <li>Exam exercises on acid-base equilibrium and titration curves.</li>
                    </ul>
                </td>
            </tr>
        </tbody>
    </table>
</div>

<!-- Chemistry Unit 5, 6 & 7 -->
<div class="unit-container">
    <div class="unit-header-box">
        <div class="unit-part-tag">Chemistry Component • Part 3 & 4: Evolution & Organic Control (Total: 17 - 30 Hours)</div>
        <div class="unit-title">Spontaneous Evolution, Batteries, Electrolysis, Esterification & Saponification</div>
        <div class="unit-meta-bar">
            <span><strong>Duration:</strong> 17 - 30 Hours</span>
            <span><strong>Streams:</strong> PC, SVT, Math A & B</span>
        </div>
    </div>

    <div class="grid-two-col">
        <div class="info-card">
            <h4>📋 Prerequisites</h4>
            <ul>
                <li>Reaction quotient Q_r and equilibrium constant K.</li>
                <li>Redox reactions and electric current definitions (I = Q / Δt).</li>
                <li>Organic chemistry basics: alcohols, carboxylic acids, and systematic nomenclature.</li>
            </ul>
        </div>
        <div class="info-card accent">
            <h4>❓ Guiding Problem Situation</h4>
            <p>Batteries power electric vehicles through spontaneous redox reactions, while electrolysis recharges accumulators and extracts pure copper. In organic synthesis, how do chemists synthesize pleasant fragrances (esters) and manufacture soap with high yields?</p>
        </div>
    </div>

    <div class="info-card" style="margin-bottom: 12px;">
        <h4>🎯 Targeted Competencies & Learning Objectives</h4>
        <ul>
            <li>Apply spontaneous evolution criterion: compare Q_r,i with K to predict spontaneous direction (forward if Q_r,i < K, reverse if Q_r,i > K).</li>
            <li>Understand electrochemical cells (Daniell cell, batteries): identify anode (oxidation), cathode (reduction), salt bridge role, and calculate electrical charge Q = I·Δt = n(e⁻)·F.</li>
            <li>Examine forced transformations via electrolysis: anode oxidation and cathode reduction imposed by external power supply; quantitative mass yield calculation m = (I·Δt·M) / (n·F).</li>
            <li>Study esterification and hydrolysis: characteristics (slow, reversible, athermic, limited yield), ester nomenclature, and methods to enhance yield (excess reactant, Dean-Stark water removal, acid anhydride).</li>
            <li>Master basic hydrolysis (saponification): reaction with NaOH/KOH (fast, total), hydrophilic and hydrophobic structure of soap ions, and cleaning mechanism.</li>
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
                    <strong>I. Spontaneous Direction Criterion</strong>
                    <ul>
                        <li>1. Comparing Q_r,i with K</li>
                        <li>2. Predictions for redox and acid-base systems</li>
                    </ul>
                    <strong>II. Electrochemical Cells (Batteries)</strong>
                    <ul>
                        <li>1. Structure: Daniell cell, electrodes, salt bridge</li>
                        <li>2. Anode oxidation & Cathode reduction</li>
                        <li>3. Electric capacity Q_max = n(e⁻)·F = I·Δt_max</li>
                    </ul>
                    <strong>III. Forced Transformations (Electrolysis)</strong>
                    <ul>
                        <li>1. Principle of forced reaction with DC generator</li>
                        <li>2. Industrial applications (electroplating, copper refining)</li>
                    </ul>
                    <strong>IV. Esterification & Hydrolysis</strong>
                    <ul>
                        <li>1. Reversible esterification-hydrolysis equilibrium & yield r</li>
                        <li>2. Shifting equilibrium (excess reactant, water removal)</li>
                        <li>3. Total ester synthesis using acid anhydride</li>
                    </ul>
                    <strong>V. Basic Hydrolysis (Saponification)</strong>
                    <ul>
                        <li>1. Saponification equation (triglyceride + 3 NaOH → glycerol + 3 soap molecules)</li>
                        <li>2. Total reaction characteristics & amphiphilic properties of soap</li>
                    </ul>
                </td>
                <td>
                    <ul>
                        <li>Copper & Zinc plates, salt bridge (KNO₃ / agar-agar)</li>
                        <li>CuSO₄ and ZnSO₄ solutions (1 mol/L)</li>
                        <li>Ammeter, voltmeter, resistors, connection leads</li>
                        <li>U-shaped electrolysis tube, graphite electrodes, DC power source</li>
                        <li>Reflux heating apparatus, round-bottom flasks, boiling stones</li>
                        <li>Reagents: Ethanol, ethanoic acid, ethanoic anhydride, olive oil, NaOH pellets, NaCl salt brine</li>
                    </ul>
                </td>
                <td>
                    <strong>Teacher:</strong>
                    <ul>
                        <li>Demonstrate Daniell cell construction and measure open-circuit electromotive force (EMF).</li>
                        <li>Direct copper chloride electrolysis and observe gas evolution and copper deposition.</li>
                        <li>Lead reflux synthesis of ethyl ethanoate and soap salting-out demonstration.</li>
                    </ul>
                    <strong>Student:</strong>
                    <ul>
                        <li>Write cell half-reactions and determine anode/cathode polarities.</li>
                        <li>Calculate mass of copper deposited during electrolysis.</li>
                        <li>Synthesize soap, perform salting-out in saturated brine, filter and test lathering power.</li>
                    </ul>
                </td>
                <td>
                    <strong>Diagnostic:</strong>
                    <ul>
                        <li>Review organic functional groups and Faraday constant.</li>
                    </ul>
                    <strong>Formative:</strong>
                    <ul>
                        <li>Cell capacity calculations and esterification yield evaluation.</li>
                    </ul>
                    <strong>Summative:</strong>
                    <ul>
                        <li>Comprehensive National Exam problems in electrochemistry and organic chemistry.</li>
                    </ul>
                </td>
            </tr>
        </tbody>
    </table>
</div>

</body>
</html>"""

def generate_french_html():
    return f"""<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>2BAC Physique-Chimie - Fiches Pédagogiques Officielles</title>
<style>{CSS_TEMPLATE}</style>
</head>
<body>

<!-- Page de Garde -->
<div class="cover-page">
    <div class="cover-badge">Royaume du Maroc • Enseignement Secondaire Qualifiant</div>
    <div class="cover-title">Fiches Pédagogiques</div>
    <div class="cover-subtitle">Physique - Chimie (2ème Année du Baccalauréat)</div>
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

<!-- ================= PARTIE 1 : LES ONDES ================= -->

<!-- Unité 1 : Ondes Mécaniques Progressives -->
<div class="unit-container">
    <div class="unit-header-box">
        <div class="unit-part-tag">Composante Physique • Partie 1 : Les Ondes (Volume Horaire : 15 - 16 Heures)</div>
        <div class="unit-title">Unité 1 : Ondes Mécaniques Progressives</div>
        <div class="unit-meta-bar">
            <span><strong>Durée :</strong> 5 Heures</span>
            <span><strong>Filières :</strong> PC, SVT, SM-A, SM-B, Agronomie</span>
        </div>
    </div>

    <div class="grid-two-col">
        <div class="info-card">
            <h4>📋 Prérequis Pédagogiques</h4>
            <ul>
                <li>Relation fondamentale entre distance, vitesse et durée (v = d / Δt).</li>
                <li>Mesures de tensions et de durées à l'aide de l'oscilloscope.</li>
                <li>Énergie mécanique d'un solide (énergie cinétique et énergie potentielle).</li>
            </ul>
        </div>
        <div class="info-card accent">
            <h4>❓ Situation-Problème & Questionnements</h4>
            <p>La propagation d'une perturbation s'accompagne d'une modification locale et temporaire des propriétés physiques d'un milieu matériel. Que traduit ce phénomène ? Quelles sont ses typologies, ses propriétés fondamentales et ses applications ?</p>
        </div>
    </div>

    <div class="info-card" style="margin-bottom: 12px;">
        <h4>🎯 Compétences Visées & Objectifs d'Apprentissage</h4>
        <ul>
            <li>Mettre en évidence qualitativement les ondes à une, deux et trois dimensions.</li>
            <li>Définir une onde mécanique progressive et distinguer ondes transversales et ondes longitudinales.</li>
            <li>Exploiter les propriétés générales des ondes (direction de propagation, superposition, non-transport de matière avec transport d'énergie).</li>
            <li>Connaître et déterminer la vitesse de propagation (v = d / Δt), ses facteurs d'influence et le retard temporel (τ = d / v).</li>
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
                    <strong>I. Exemples d'Ondes Mécaniques</strong>
                    <ul>
                        <li>1. Onde transversale (corde, surface de l'eau)</li>
                        <li>2. Onde longitudinale (ressort, son dans l'air)</li>
                    </ul>
                    <strong>II. Propriétés des Ondes Mécaniques</strong>
                    <ul>
                        <li>1. Définition de l'onde mécanique progressive</li>
                        <li>2. Sens et dimension de propagation</li>
                        <li>3. Vitesse de propagation et facteurs d'influence</li>
                    </ul>
                    <strong>III. Onde Progressive à 1D - Retard Temporel</strong>
                    <ul>
                        <li>1. Définition du retard temporel τ = SM / v</li>
                        <li>2. Relation d'élongation : y_M(t) = y_S(t - τ)</li>
                    </ul>
                </td>
                <td>
                    <ul>
                        <li>Manuel scolaire & tableau</li>
                        <li>Ordinateur, vidéoprojecteur & animations</li>
                        <li>Corde élastique & ressort à spires non jointives</li>
                        <li>Cuve à ondes avec accessoires</li>
                        <li>Diapason & cloche à vide avec pompe</li>
                        <li>Oscilloscope bicourbe, 2 microphones & câbles</li>
                        <li>Cellules photoélectriques & chronomètre numérique</li>
                    </ul>
                </td>
                <td>
                    <strong>Activité de l'Enseignant :</strong>
                    <ul>
                        <li>Poser des questions diagnostiques sur les acquis antérieurs.</li>
                        <li>Réaliser les manipulations expérimentales (corde, ressort, cuve à ondes).</li>
                        <li>Formuler rigoureusement les définitions et lois scientifiques.</li>
                    </ul>
                    <strong>Activité de l'Apprenant :</strong>
                    <ul>
                        <li>Observer, décrire et classifier les types d'ondes.</li>
                        <li>Exploiter les documents expérimentaux pour calculer v et τ.</li>
                    </ul>
                </td>
                <td>
                    <strong>Diagnostique :</strong>
                    <ul>
                        <li>Questions orales/écrites sur la vitesse et les unités SI.</li>
                    </ul>
                    <strong>Formative :</strong>
                    <ul>
                        <li>Exploitation d'oscillogrammes et de chronophotographies.</li>
                    </ul>
                    <strong>Sommative :</strong>
                    <ul>
                        <li>Exercices d'application & Devoir surveillé N° 1.</li>
                    </ul>
                </td>
            </tr>
        </tbody>
    </table>
</div>

<!-- Unité 2 : Ondes Mécaniques Périodiques -->
<div class="unit-container">
    <div class="unit-header-box">
        <div class="unit-part-tag">Composante Physique • Partie 1 : Les Ondes</div>
        <div class="unit-title">Unité 2 : Ondes Mécaniques Progressives Périodiques</div>
        <div class="unit-meta-bar">
            <span><strong>Durée :</strong> 5 Heures</span>
            <span><strong>Filières :</strong> PC, SVT, SM-A, SM-B</span>
        </div>
    </div>

    <div class="grid-two-col">
        <div class="info-card">
            <h4>📋 Prérequis Pédagogiques</h4>
            <ul>
                <li>Notion d'onde mécanique progressive et classifications.</li>
                <li>Vitesse de propagation, distance et retard temporel.</li>
                <li>Mesures et visualisations à l'oscilloscope ou sur ordinateur.</li>
            </ul>
        </div>
        <div class="info-card accent">
            <h4>❓ Situation-Problème & Questionnements</h4>
            <p>La houle en haute mer se propage vers les côtes sous forme d'ondes progressives sinusoïdales. Quelles sont les caractéristiques d'une onde périodique ? Que se passe-t-il lorsqu'une onde rencontre une fente étroite à la surface de l'eau ?</p>
        </div>
    </div>

    <div class="info-card" style="margin-bottom: 12px;">
        <h4>🎯 Compétences Visées & Objectifs d'Apprentissage</h4>
        <ul>
            <li>Définir une onde mécanique progressive périodique et sinusoïdale.</li>
            <li>Identifier la double périodicité : périodicité temporelle T (et fréquence N = 1/T) et spatiale λ (longueur d'onde).</li>
            <li>Maîtriser la relation fondamentale : λ = v · T = v / N.</li>
            <li>Mettre en évidence et caractériser le phénomène de diffraction d'une onde mécanique (condition : a ≤ λ).</li>
            <li>Définir et reconnaître un milieu dispersif (où la vitesse dépend de la fréquence).</li>
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
                    <strong>I. Ondes Mécaniques Périodiques</strong>
                    <ul>
                        <li>1. Définition & caractéristiques</li>
                        <li>2. Vitesse de propagation</li>
                        <li>3. Étude stroboscopique (immobilité apparente)</li>
                    </ul>
                    <strong>II. Onde Progressive Sinusoïdale</strong>
                    <ul>
                        <li>1. Onde sinusoïdale le long d'une corde</li>
                        <li>2. Onde à la surface de l'eau (circulaire et rectiligne)</li>
                        <li>3. Onde sonore et ultrasonore</li>
                    </ul>
                    <strong>III. Diffraction des Ondes Mécaniques</strong>
                    <ul>
                        <li>1. Étude expérimentale avec obstacle à fente</li>
                        <li>2. Conditions d'observation de la diffraction (a ≤ λ)</li>
                        <li>3. Diffraction des ondes sonores</li>
                    </ul>
                    <strong>IV. Milieu Dispersif</strong>
                    <ul>
                        <li>1. Variation de la fréquence et mesure de vitesse</li>
                        <li>2. Définition du milieu dispersif</li>
                    </ul>
                </td>
                <td>
                    <ul>
                        <li>Cuve à ondes complète avec vibreur & pointes/réglettes</li>
                        <li>Stroboscope & générateur basse fréquence (GBF)</li>
                        <li>Lame vibrante, fil à plomb & morceaux de liège</li>
                        <li>Haut-parleur & 2 microphones de mesure</li>
                        <li>Oscilloscope bicourbe & fils de connexion</li>
                        <li>Diaphragmes à fentes réglables</li>
                        <li>Logiciels de simulation (Avimeca / Regressi)</li>
                    </ul>
                </td>
                <td>
                    <strong>Activité de l'Enseignant :</strong>
                    <ul>
                        <li>Illustrer l'immobilité apparente au stroboscope.</li>
                        <li>Guider la mesure expérimentale de λ sur cuve et oscilloscope.</li>
                        <li>Mettre en évidence la diffraction par une ouverture réglable.</li>
                    </ul>
                    <strong>Activité de l'Apprenant :</strong>
                    <ul>
                        <li>Déterminer la période T et la longueur d'onde λ.</li>
                        <li>Calculer la vitesse v et vérifier l'effet dispersif du milieu.</li>
                    </ul>
                </td>
                <td>
                    <strong>Diagnostique :</strong>
                    <ul>
                        <li>Contrôle des notions de période, fréquence et unités.</li>
                    </ul>
                    <strong>Formative :</strong>
                    <ul>
                        <li>Exercices de détermination de phase sur oscilloscope.</li>
                    </ul>
                    <strong>Sommative :</strong>
                    <ul>
                        <li>Questions d'examens sur la diffraction et les milieux dispersifs.</li>
                    </ul>
                </td>
            </tr>
        </tbody>
    </table>
</div>

<!-- Unité 3 : Propagation d'une Onde Lumineuse -->
<div class="unit-container">
    <div class="unit-header-box">
        <div class="unit-part-tag">Composante Physique • Partie 1 : Les Ondes</div>
        <div class="unit-title">Unité 3 : Propagation d'une Onde Lumineuse</div>
        <div class="unit-meta-bar">
            <span><strong>Durée :</strong> 5 - 6 Heures</span>
            <span><strong>Filières :</strong> PC, SVT, SM-A, SM-B</span>
        </div>
    </div>

    <div class="grid-two-col">
        <div class="info-card">
            <h4>📋 Prérequis Pédagogiques</h4>
            <ul>
                <li>Phénomène de diffraction des ondes mécaniques.</li>
                <li>Relation d'onde : λ = v · T = v / ν.</li>
                <li>Milieux transparents homogènes et lois de Snell-Descartes.</li>
            </ul>
        </div>
        <div class="info-card accent">
            <h4>❓ Situation-Problème & Questionnements</h4>
            <p>Les faisceaux laser sont très employés dans l'industrie et la chirurgie. Comment le phénomène de diffraction prouve-t-il la nature ondulatoire de la lumière, et comment permet-il de mesurer des diamètres microscopiques de fils ou de cheveux ?</p>
        </div>
    </div>

    <div class="info-card" style="margin-bottom: 12px;">
        <h4>🎯 Compétences Visées & Objectifs d'Apprentissage</h4>
        <ul>
            <li>Établir la nature ondulatoire de la lumière grâce au phénomène de diffraction.</li>
            <li>Maîtriser la relation d'écart angulaire θ = λ / a et la formule géométrique tan(θ) ≈ L / (2D).</li>
            <li>Distinguer lumière monochromatique (fréquence unique) et lumière polychromatique.</li>
            <li>Comprendre la dispersion de la lumière par un prisme et constater l'invariance de la fréquence ν selon le milieu.</li>
            <li>Calculer l'indice de réfraction n = c / v (n > 1) et appliquer les formules du prisme.</li>
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
                    <strong>I. Diffraction de la Lumière</strong>
                    <ul>
                        <li>1. Phénomène de diffraction & modèle ondulatoire</li>
                        <li>2. Étude de la diffraction par une fente / cheveu</li>
                        <li>3. Écart angulaire : θ = λ / a</li>
                        <li>4. Détermination de la dimension a = 2λD / L</li>
                    </ul>
                    <strong>II. Dispersion de la Lumière</strong>
                    <ul>
                        <li>1. Indice de réfraction n = c / v</li>
                        <li>2. Dispersion de la lumière blanche par un prisme</li>
                        <li>3. Lois de Descartes & formules du prisme :
                            sin(i) = n·sin(r), sin(i') = n·sin(r'), A = r + r', D = i + i' - A</li>
                    </ul>
                </td>
                <td>
                    <ul>
                        <li>Source laser monochromatique rouge (λ ≈ 650 nm) & verte</li>
                        <li>Fentes étalonnées, trous circulaires & fils calibrés</li>
                        <li>Écran de projection blanc & ruban millimétré</li>
                        <li>Prisme en verre/plexiglas & goniomètre</li>
                        <li>Lanterne de lumière blanche & lentille convergente</li>
                        <li>Disque de Newton motorisé</li>
                        <li>Logiciels d'optique ondulatoire</li>
                    </ul>
                </td>
                <td>
                    <strong>Activité de l'Enseignant :</strong>
                    <ul>
                        <li>Réaliser le montage de diffraction laser en respectant les consignes de sécurité.</li>
                        <li>Guider le tracé de la droite d'étalonnage θ en fonction de 1/a.</li>
                        <li>Présenter la décomposition spectrale par le prisme.</li>
                    </ul>
                    <strong>Activité de l'Apprenant :</strong>
                    <ul>
                        <li>Mesurer la largeur L de la tache centrale en fonction de a et D.</li>
                        <li>Calculer la longueur d'onde λ à partir du coefficient directeur.</li>
                    </ul>
                </td>
                <td>
                    <strong>Diagnostique :</strong>
                    <ul>
                        <li>Vérification des lois de l'optique géométrique (réflexion, réfraction).</li>
                    </ul>
                    <strong>Formative :</strong>
                    <ul>
                        <li>Calcul de pente et incertitudes sur les courbes de diffraction.</li>
                    </ul>
                    <strong>Sommative :</strong>
                    <ul>
                        <li>Exercices types Baccalauréat sur les ondes lumineuses.</li>
                    </ul>
                </td>
            </tr>
        </tbody>
    </table>
</div>

<!-- ================= PARTIE 2 : TRANSFORMATIONS NUCLÉAIRES ================= -->

<!-- Nucléaire Unité 1 & 2 -->
<div class="unit-container">
    <div class="unit-header-box">
        <div class="unit-part-tag">Composante Physique • Partie 2 : Transformations Nucléaires (Total : 10 - 14 Heures)</div>
        <div class="unit-title">Décroissance Radioactive, Noyaux, Masse et Énergie</div>
        <div class="unit-meta-bar">
            <span><strong>Durée :</strong> 10 - 14 Heures</span>
            <span><strong>Filières :</strong> PC, SVT, SM-A, SM-B</span>
        </div>
    </div>

    <div class="grid-two-col">
        <div class="info-card">
            <h4>📋 Prérequis Pédagogiques</h4>
            <ul>
                <li>Structure de l'atome : protons (Z), neutrons (N), nucléons (A).</li>
                <li>Définition des isotopes et neutralité électrique de l'atome.</li>
                <li>Lois de conservation de la masse-énergie et des charges.</li>
            </ul>
        </div>
        <div class="info-card accent">
            <h4>❓ Situation-Problème & Questionnements</h4>
            <p>La datation au Carbone 14 permet de dater des fossiles anciens, tandis que la fission de l'Uranium 235 produit une énergie colossale dans les réacteurs. Quelles lois régissent la décroissance radioactive, le défaut de masse et l'énergie de liaison nucléaire ?</p>
        </div>
    </div>

    <div class="info-card" style="margin-bottom: 12px;">
        <h4>🎯 Compétences Visées & Objectifs d'Apprentissage</h4>
        <ul>
            <li>Interpréter le symbole d'un nucléide ^A_Z X et analyser le diagramme de Segrè (N en fonction de Z).</li>
            <li>Appliquer les lois de conservation de Soddy pour équilibrer les équations de désintégration (α, β⁻, β⁺, γ).</li>
            <li>Exploiter la loi de décroissance radioactive : N(t) = N₀ · e^(-λt) et relier demi-vie et constante : t_(1/2) = ln(2) / λ.</li>
            <li>Définir l'activité A(t) = λ·N(t) en Becquerels (Bq) et résoudre des problèmes de datation radioactive.</li>
            <li>Calculer le défaut de masse Δm et l'énergie de liaison E_l = Δm · c² ainsi que l'énergie par nucléon E_l / A.</li>
            <li>Analyser la courbe d'Aston (-E_l / A en fonction de A) pour interpréter la fission et la fusion nucléaires.</li>
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
                    <strong>Partie 1 : Décroissance Radioactive</strong>
                    <ul>
                        <li>1. Stabilité nucléaire & diagramme de Segrè</li>
                        <li>2. Radioactivités spontanées : α, β⁻, β⁺ et désexcitation γ</li>
                        <li>3. Lois de conservation de Soddy</li>
                        <li>4. Loi de décroissance N(t), demi-vie t_(1/2) & activité A(t)</li>
                        <li>5. Datation au Carbone 14 et autres nucléides</li>
                    </ul>
                    <strong>Partie 2 : Masse, Énergie & Réactions Nucléaires</strong>
                    <ul>
                        <li>1. Équivalence masse-énergie : E = m·c²</li>
                        <li>2. Défaut de masse Δm & énergie de liaison E_l</li>
                        <li>3. Énergie de liaison par nucléon E_l / A</li>
                        <li>4. Courbe d'Aston, fission de l'U-235 et fusion de l'hydrogène</li>
                        <li>5. Bilan énergétique : ΔE = [Σm_produits - Σm_réactifs]·c²</li>
                    </ul>
                </td>
                <td>
                    <ul>
                        <li>Compteur Geiger-Müller & mesures de radioactivité ambiante</li>
                        <li>Diagramme de Segrè (N, Z) mural / logiciel interactif</li>
                        <li>Courbe d'Aston officielle</li>
                        <li>Logiciel de simulation de désintégration (modèle des dés)</li>
                        <li>Calculatrice scientifique & tables de masses atomiques (u, MeV/c²)</li>
                        <li>Documentaires vidéo sur les réacteurs nucléaires</li>
                    </ul>
                </td>
                <td>
                    <strong>Activité de l'Enseignant :</strong>
                    <ul>
                        <li>Introduire la décroissance à l'aide de l'analogie du lancer de dés.</li>
                        <li>Guider l'application rigoureuse des lois de Soddy.</li>
                        <li>Conduire le calcul de l'énergie libérée E_lib = |ΔE|.</li>
                    </ul>
                    <strong>Activité de l'Apprenant :</strong>
                    <ul>
                        <li>Équilibrer les réactions nucléaires α, β⁻, β⁺.</li>
                        <li>Déterminer l'âge d'un échantillon archéologique par datation radiochimique.</li>
                        <li>Calculer le défaut de masse en unité u et convertir en MeV.</li>
                    </ul>
                </td>
                <td>
                    <strong>Diagnostique :</strong>
                    <ul>
                        <li>Test de rappel sur la structure du noyau.</li>
                    </ul>
                    <strong>Formative :</strong>
                    <ul>
                        <li>Lecture graphique de t_(1/2) et linéarisation logarithmique ln(N) = f(t).</li>
                    </ul>
                    <strong>Sommative :</strong>
                    <ul>
                        <li>Devoir surveillé N° 2 sur la physique nucléaire et la datation.</li>
                    </ul>
                </td>
            </tr>
        </tbody>
    </table>
</div>

<!-- ================= PARTIE 3 : ÉLECTRICITÉ ================= -->

<!-- Électricité RC, RL, RLC -->
<div class="unit-container">
    <div class="unit-header-box">
        <div class="unit-part-tag">Composante Physique • Partie 3 : Électricité (Total : 22 - 38 Heures)</div>
        <div class="unit-title">Dipôle RC, Dipôle RL et Oscillations Libres RLC Série</div>
        <div class="unit-meta-bar">
            <span><strong>Durée :</strong> 22 - 38 Heures</span>
            <span><strong>Filières :</strong> PC, SVT, SM-A, SM-B</span>
        </div>
    </div>

    <div class="grid-two-col">
        <div class="info-card">
            <h4>📋 Prérequis Pédagogiques</h4>
            <ul>
                <li>Nature du courant électrique dans les métaux et loi d'Ohm.</li>
                <li>Lois de Kirchhoff : loi des nœuds et loi d'additivité des tensions.</li>
                <li>Utilisation de l'oscilloscope et montages en dérivation/série.</li>
            </ul>
        </div>
        <div class="info-card accent">
            <h4>❓ Situation-Problème & Questionnements</h4>
            <p>Le flash d'un appareil photo libère instantanément l'énergie accumulée dans un condensateur, tandis qu'une bobine s'oppose aux variations brutales de courant. Comment les circuits RC, RL et RLC répondent-ils à un échelon de tension ?</p>
        </div>
    </div>

    <div class="info-card" style="margin-bottom: 12px;">
        <h4>🎯 Compétences Visées & Objectifs d'Apprentissage</h4>
        <ul>
            <li>Établir et résoudre l'équation différentielle du dipôle RC lors de la charge et décharge : u_C(t) + RC · (du_C/dt) = E.</li>
            <li>Déterminer la constante de temps τ = RC (tangente à l'origine, règle des 63%) et calculer l'énergie E_e = 0,5·C·u_C².</li>
            <li>Établir l'équation différentielle du dipôle RL : u_L + Ri = E avec u_L = L(di/dt) + ri, en déduire τ = L / (R + r) et E_m = 0,5·L·i².</li>
            <li>Étudier le circuit RLC série : identifier les régimes d'oscillations (pseudopériodique, apériodique, critique), calculer la période propre T₀ = 2π√(LC) et analyser l'amortissement énergétique et son entretien.</li>
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
                    <strong>I. Le Dipôle RC</strong>
                    <ul>
                        <li>1. Condensateur, capacité C, relation q = C·u_C</li>
                        <li>2. Réponse à un échelon de tension : charge et décharge</li>
                        <li>3. Équation différentielle & solution analytique</li>
                        <li>4. Constante de temps τ = RC & énergie E_e = 0,5 C u_C²</li>
                    </ul>
                    <strong>II. Le Dipôle RL</strong>
                    <ul>
                        <li>1. Bobine, inductance L, résistance interne r, tension u_L = L(di/dt) + ri</li>
                        <li>2. Établissement et rupture du courant</li>
                        <li>3. Constante de temps τ = L / R_tot & énergie E_m = 0,5 L i²</li>
                    </ul>
                    <strong>III. Le Circuit RLC Série</strong>
                    <ul>
                        <li>1. Oscillations libres amorties (pseudopériode T ≈ T₀)</li>
                        <li>2. Circuit idéal LC & équation : d²u_C/dt² + (1/LC)u_C = 0</li>
                        <li>3. Échanges d'énergie totale E_T = E_e + E_m & dissipation</li>
                        <li>4. Entretien des oscillations par amplificateur opérationnel</li>
                    </ul>
                </td>
                <td>
                    <ul>
                        <li>Alimentation stabilisée continue & générateur GBF</li>
                        <li>Boîtes de condensateurs à décades (0,1 µF à 100 µF)</li>
                        <li>Boîtes de résistances variables à décades (10 Ω à 10 kΩ)</li>
                        <li>Bobines d'inductance à noyau de fer doux (0,1 H à 1 H)</li>
                        <li>Oscilloscope numérique à mémoire / interface d'acquisition PC</li>
                        <li>Montage à amplificateur opérationnel (résistance négative)</li>
                    </ul>
                </td>
                <td>
                    <strong>Activité de l'Enseignant :</strong>
                    <ul>
                        <li>Superviser le câblage et vérifier l'isolation des masses.</li>
                        <li>Guider l'acquisition des régimes transitoires u_C(t) et u_R(t).</li>
                        <li>Démontrer la résolution mathématique des équations différentielles.</li>
                    </ul>
                    <strong>Activité de l'Apprenant :</strong>
                    <ul>
                        <li>Réaliser les montages RC, RL et RLC selon les schémas conventionnels.</li>
                        <li>Déterminer expérimentalement la constante de temps τ.</li>
                        <li>Vérifier la période propre T₀ = 2π√(LC) et analyser l'amortissement.</li>
                    </ul>
                </td>
                <td>
                    <strong>Diagnostique :</strong>
                    <ul>
                        <li>Rappel des lois d'Ohm et de Kirchhoff.</li>
                    </ul>
                    <strong>Formative :</strong>
                    <ul>
                        <li>Établissement des équations différentielles et analyse dimensionnelle de τ.</li>
                    </ul>
                    <strong>Sommative :</strong>
                    <ul>
                        <li>Devoir surveillé sur les régimes transitoires et oscillants.</li>
                    </ul>
                </td>
            </tr>
        </tbody>
    </table>
</div>

<!-- ================= PARTIE 4 : MÉCANIQUE ================= -->

<!-- Mécanique Newton, Chute, Projectiles, Satellites -->
<div class="unit-container">
    <div class="unit-header-box">
        <div class="unit-part-tag">Composante Physique • Partie 4 : Mécanique Classique (Total : 35 - 47 Heures)</div>
        <div class="unit-title">Lois de Newton, Projectiles, Satellites et Oscillateurs Mécaniques</div>
        <div class="unit-meta-bar">
            <span><strong>Durée :</strong> 35 - 47 Heures</span>
            <span><strong>Filières :</strong> PC, SVT, SM-A, SM-B</span>
        </div>
    </div>

    <div class="grid-two-col">
        <div class="info-card">
            <h4>📋 Prérequis Pédagogiques</h4>
            <ul>
                <li>Vecteurs vitesse et accélération ; repères cartésien et de Frenet.</li>
                <li>Équilibre d'un solide et forces de frottement solide.</li>
                <li>Travail d'une force, théorème de l'énergie cinétique et conservation de l'énergie mécanique.</li>
            </ul>
        </div>
        <div class="info-card accent">
            <h4>❓ Situation-Problème & Questionnements</h4>
            <p>De la trajectoire d'un ballon de football aux orbites satellitaires et au balancier des horloges, le mouvement répond à des lois universelles. Comment les lois de Newton décrivent-elles ces trajectoires et oscillateurs ?</p>
        </div>
    </div>

    <div class="info-card" style="margin-bottom: 12px;">
        <h4>🎯 Compétences Visées & Objectifs d'Apprentissage</h4>
        <ul>
            <li>Énoncer et appliquer les trois lois de Newton (Inertie, Principe Fondamental ΣF_ext = m·a_G, Action-Réaction).</li>
            <li>Étudier la chute verticale : chute libre vs chute avec frottement fluide f = -k·v^n ; résoudre l'équation différentielle par la méthode numérique d'Euler.</li>
            <li>Étudier le mouvement d'un projectile dans un champ de pesanteur uniforme : équations horaires, équation de la trajectoire y(x), portée et flèche.</li>
            <li>Maîtriser le mouvement des planètes et satellites (lois de Kepler, vitesse orbitale v = √(G·M/r), période T et satellites géostationnaires).</li>
            <li>Étudier les oscillateurs mécaniques harmoniques (pendule élastique, de torsion, simple) : équations différentielles, période propre T₀ et énergie mécanique.</li>
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
                    <strong>I. Lois de Newton & Mouvement Rectiligne</strong>
                    <ul>
                        <li>1. Vecteurs cinématiques & repère de Frenet</li>
                        <li>2. 2ème loi de Newton : ΣF = m·a_G</li>
                        <li>3. Mouvement sur plan horizontal et plan incliné</li>
                    </ul>
                    <strong>II. Chute Verticale & Frottement Fluide</strong>
                    <ul>
                        <li>1. Chute libre : a = g, v(t) = g·t</li>
                        <li>2. Chute visqueuse : dv/dt = A - B·v ; vitesse limite v_lim ; méthode d'Euler</li>
                    </ul>
                    <strong>III. Mouvements Plans : Projectiles & Particules</strong>
                    <ul>
                        <li>1. Équations horaires : x(t) = (v₀·cosα)·t, y(t) = -0,5g·t² + (v₀·sinα)·t</li>
                        <li>2. Particule chargée dans un champ magnétique : force de Lorentz F = q(v × B), trajectoire circulaire R = m·v / (|q|·B)</li>
                    </ul>
                    <strong>IV. Mouvement des Planètes & Satellites</strong>
                    <ul>
                        <li>Lois de Kepler, vitesse orbitale circulaire & condition géostationnaire</li>
                    </ul>
                    <strong>V. Oscillateurs Mécaniques & Énergie</strong>
                    <ul>
                        <li>Système solide-ressort : m·x'' + k·x = 0 ; T₀ = 2π√(m/k)</li>
                        <li>Conservation et non-conservation de l'énergie mécanique</li>
                    </ul>
                </td>
                <td>
                    <ul>
                        <li>Banc à coussin d'air rectiligne avec fourches optiques & mobile</li>
                        <li>Éprouvette graduée remplie de glycérol & billes en acier</li>
                        <li>Caméra vidéo numérique & logiciel de pointage Avimeca / Regressi</li>
                        <li>Ressorts hélicoïdaux de raideur k connue & masses marquées</li>
                        <li>Dispositif de pendule de torsion & pendule simple</li>
                        <li>Tableur informatique pour l'itération de la méthode d'Euler</li>
                    </ul>
                </td>
                <td>
                    <strong>Activité de l'Enseignant :</strong>
                    <ul>
                        <li>Valider expérimentalement la 2ème loi de Newton sur banc à air.</li>
                        <li>Filmer le tir d'un projectile et traiter la trajectoire par pointage.</li>
                        <li>Expliciter les étapes algorithmiques de la méthode d'Euler.</li>
                    </ul>
                    <strong>Activité de l'Apprenant :</strong>
                    <ul>
                        <li>Établir l'équation cartésienne de la trajectoire et calculer la portée.</li>
                        <li>Tracer v(t) lors de la chute avec frottement et relever la vitesse limite.</li>
                        <li>Mesurer la période des oscillations et comparer à T₀ théorique.</li>
                    </ul>
                </td>
                <td>
                    <strong>Diagnostique :</strong>
                    <ul>
                        <li>Contrôle sur la dérivation et la projection vectorielle.</li>
                    </ul>
                    <strong>Formative :</strong>
                    <ul>
                        <li>Calculs d'itérations sur tableau d'Euler.</li>
                    </ul>
                    <strong>Sommative :</strong>
                    <ul>
                        <li>Problèmes types Baccalauréat National en mécanique.</li>
                    </ul>
                </td>
            </tr>
        </tbody>
    </table>
</div>

<!-- ================= PARTIE 5 : CHIMIE ================= -->

<!-- Chimie Unité 1 & 2 -->
<div class="unit-container">
    <div class="unit-header-box">
        <div class="unit-part-tag">Composante Chimie • Partie 1 : Transformations Lentes & Rapides (Total : 8 - 11 Heures)</div>
        <div class="unit-title">Cinétique Chimique & Suivi Temporel d'une Réaction</div>
        <div class="unit-meta-bar">
            <span><strong>Durée :</strong> 8 - 11 Heures</span>
            <span><strong>Filières :</strong> PC, SVT, SM-A, SM-B</span>
        </div>
    </div>

    <div class="grid-two-col">
        <div class="info-card">
            <h4>📋 Prérequis Pédagogiques</h4>
            <ul>
                <li>Notions d'oxydoréduction : oxydants, réducteurs et transferts d'électrons.</li>
                <li>Avancement de réaction x, tableau d'avancement et réactif limitant.</li>
                <li>Conductimétrie (σ = Σ λ_i · [X_i]) et loi des gaz parfaits (P·V = n·R·T).</li>
            </ul>
        </div>
        <div class="info-card accent">
            <h4>❓ Situation-Problème & Questionnements</h4>
            <p>Les pages des livres anciens jaunissent lentement au fil des décennies, alors que la combustion de l'essence dans un moteur est quasi-instantanée. Qu'est-ce qui distingue transformations lentes et rapides ? Comment suivre et réguler leur vitesse ?</p>
        </div>
    </div>

    <div class="info-card" style="margin-bottom: 12px;">
        <h4>🎯 Compétences Visées & Objectifs d'Apprentissage</h4>
        <ul>
            <li>Distinguer transformations rapides (instantanées) et lentes (observables à l'échelle humaine).</li>
            <li>Identifier les facteurs cinétiques : concentration initiale, température et catalyseurs.</li>
            <li>Maîtriser les méthodes de suivi : dosage chimique, conductimétrie, spectrophotométrie et manométrie.</li>
            <li>Définir la vitesse volumique de réaction : v = (1/V) · (dx/dt) et justifier sa diminution au cours du temps.</li>
            <li>Définir le temps de demi-réaction t_(1/2) où x(t_(1/2)) = x_f / 2 et le déterminer graphiquement.</li>
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
                    <strong>I. Rappels d'Oxydoréduction</strong>
                    <ul>
                        <li>1. Couples Ox/Red & demi-équations électroniques</li>
                        <li>2. Équations de réactions d'oxydoréduction</li>
                    </ul>
                    <strong>II. Transformations Rapides et Lentes</strong>
                    <ul>
                        <li>1. Réactions instantanées de précipitation</li>
                        <li>2. Réactions lentes (ex : oxydation des ions iodure par l'eau oxygénée)</li>
                    </ul>
                    <strong>III. Facteurs Cinétiques</strong>
                    <ul>
                        <li>1. Effet de la température (trempe thermique)</li>
                        <li>2. Effet des concentrations initiales</li>
                        <li>3. Catalyseurs</li>
                    </ul>
                    <strong>IV. Suivi Temporel d'une Réaction</strong>
                    <ul>
                        <li>1. Suivi par titrage volumétrique (avec trempe dans eau glacée)</li>
                        <li>2. Suivi par conductimétrie & pressiométrie</li>
                        <li>3. Vitesse volumique v = (1/V)·dx/dt (pente de la tangente)</li>
                        <li>4. Temps de demi-réaction t_(1/2) : définition & détermination</li>
                    </ul>
                </td>
                <td>
                    <ul>
                        <li>Béchers, éprouvettes graduées, burettes, pipettes jaugées</li>
                        <li>Solutions : KI, H₂O₂, Na₂S₂O₃, empois d'amidon, HCl, ruban de Mg</li>
                        <li>Agitateurs magnétiques & bain-marie thermostaté</li>
                        <li>Conductimètre étalonné & cellule de mesure</li>
                        <li>Capteur de pression / manomètre numérique & fiole étanche</li>
                        <li>Chronomètre & bain d'eau glacée pour trempe chimique</li>
                    </ul>
                </td>
                <td>
                    <strong>Activité de l'Enseignant :</strong>
                    <ul>
                        <li>Présenter la réaction lente I⁻ + H₂O₂ et illustrer l'effet thermique.</li>
                        <li>Guider le protocole de trempe et de dosage du diiode formé.</li>
                        <li>Expliquer la méthode de la tangente pour le calcul de vitesse.</li>
                    </ul>
                    <strong>Activité de l'Apprenant :</strong>
                    <ul>
                        <li>Dresser le tableau d'avancement et exprimer x(t) d'après les titrages.</li>
                        <li>Tracer la courbe x(t), mener les tangentes et calculer v(t).</li>
                        <li>Déterminer t_(1/2) à partir de x_max / 2 sur le graphique.</li>
                    </ul>
                </td>
                <td>
                    <strong>Diagnostique :</strong>
                    <ul>
                        <li>Contrôle sur l'équilibrage des réactions redox et n = C·V.</li>
                    </ul>
                    <strong>Formative :</strong>
                    <ul>
                        <li>Calcul de vitesse à partir de tangentes tracées par les élèves.</li>
                    </ul>
                    <strong>Sommative :</strong>
                    <ul>
                        <li>Exercices types Baccalauréat en cinétique chimique.</li>
                    </ul>
                </td>
            </tr>
        </tbody>
    </table>
</div>

<!-- Chimie Unité 3 & 4 -->
<div class="unit-container">
    <div class="unit-header-box">
        <div class="unit-part-tag">Composante Chimie • Partie 2 : Transformations Non Totales (Total : 13 - 17 Heures)</div>
        <div class="unit-title">Réactions Réversibles, Équilibre Chimique & Solutions Acido-Basiques</div>
        <div class="unit-meta-bar">
            <span><strong>Durée :</strong> 13 - 17 Heures</span>
            <span><strong>Filières :</strong> PC, SVT, SM-A, SM-B</span>
        </div>
    </div>

    <div class="grid-two-col">
        <div class="info-card">
            <h4>📋 Prérequis Pédagogiques</h4>
            <ul>
                <li>Définition des acides et bases selon Brønsted (transfert de proton H⁺).</li>
                <li>Définition du pH pour solutions diluées (pH = -log[H₃O⁺]).</li>
                <li>Conductivité des solutions ioniques et tableaux d'avancement.</li>
            </ul>
        </div>
        <div class="info-card accent">
            <h4>❓ Situation-Problème & Questionnements</h4>
            <p>Dans les grottes calcaires, stalactites et stalagmites résultent d'équilibres chimiques réversibles. Qu'est-ce qui caractérise un état d'équilibre où la réaction ne parvient pas à son terme ? Comment quantifier la force des acides et bases ?</p>
        </div>
    </div>

    <div class="info-card" style="margin-bottom: 12px;">
        <h4>🎯 Compétences Visées & Objectifs d'Apprentissage</h4>
        <ul>
            <li>Définir le taux d'avancement final τ = x_f / x_max et distinguer réaction totale (τ = 1) et limitée (τ < 1).</li>
            <li>Exprimer le quotient de réaction Q_r et la constante d'équilibre K ; vérifier que K dépend uniquement de la température.</li>
            <li>Maîtriser le produit ionique de l'eau K_e = [H₃O⁺]·[HO⁻] = 10^(-14) à 25°C et la constante d'acidité K_a.</li>
            <li>Construire et exploiter les diagrammes de prédominance via pH = pK_a + log([A⁻]/[HA]).</li>
            <li>Réaliser des dosages pH-métriques, déterminer le point d'équivalence (méthode des tangentes & dérivée dpH/dV) et choisir l'indicateur coloré convenable.</li>
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
                    <strong>I. Transformations Chimiques Non Totales</strong>
                    <ul>
                        <li>1. Avancement final x_f vs avancement maximal x_max</li>
                        <li>2. Taux d'avancement final τ = x_f / x_max</li>
                        <li>3. Interprétation microscopique de l'équilibre dynamique</li>
                    </ul>
                    <strong>II. État d'Équilibre d'un Système Chimique</strong>
                    <ul>
                        <li>1. Quotient de réaction Q_r & valeur à l'équilibre Q_r,eq</li>
                        <li>2. Constante d'équilibre K = Q_r,eq</li>
                        <li>3. Influence de la concentration initiale sur le taux τ</li>
                    </ul>
                    <strong>III. Réactions Acido-Basiques en Solution Aqueuse</strong>
                    <ul>
                        <li>1. Autoprotolyse de l'eau K_e & milieux acide/neutre/basique</li>
                        <li>2. Constante d'acidité K_a, pK_a = -log(K_a) et relation avec le pH</li>
                        <li>3. Diagrammes de prédominance et de distribution</li>
                        <li>4. Titrage pH-métrique, point d'équivalence & choix d'indicateur</li>
                    </ul>
                </td>
                <td>
                    <ul>
                        <li>pH-mètre numérique étalonné avec solutions tampons (pH 4,00, 7,00, 10,00)</li>
                        <li>Solutions : Acide éthanoïque, acide chlorhydrique, soude NaOH, acide méthanoïque</li>
                        <li>Burette graduée de précision (25 mL) & pipettes jaugées</li>
                        <li>Agitateur magnétique & barreau aimanté</li>
                        <li>Indicateurs colorés : Bleu de bromothymol, phénolphtaléine, hélianthine</li>
                    </ul>
                </td>
                <td>
                    <strong>Activité de l'Enseignant :</strong>
                    <ul>
                        <li>Superviser les mesures de pH et calibrer les pH-mètres.</li>
                        <li>Guider le calcul de τ pour comparer acide fort et acide faible à même concentration.</li>
                        <li>Démontrer la méthode des tangentes parallèles au point d'équivalence.</li>
                    </ul>
                    <strong>Activité de l'Apprenant :</strong>
                    <ul>
                        <li>Mesurer le pH, calculer [H₃O⁺] et en déduire x_f et le taux τ.</li>
                        <li>Tracer la courbe de titrage pH = f(V_b) et repérer le volume d'équivalence V_bE.</li>
                        <li>Justifier le choix de l'indicateur coloré dont la zone de virage encadre le pH à l'équivalence.</li>
                    </ul>
                </td>
                <td>
                    <strong>Diagnostique :</strong>
                    <ul>
                        <li>Rappels sur la définition du pH et les calculs de concentrations.</li>
                    </ul>
                    <strong>Formative :</strong>
                    <ul>
                        <li>Calcul de K à partir du tableau d'avancement à l'équilibre.</li>
                    </ul>
                    <strong>Sommative :</strong>
                    <ul>
                        <li>Exercices de type examen national sur l'équilibre acido-basique.</li>
                    </ul>
                </td>
            </tr>
        </tbody>
    </table>
</div>

<!-- Chimie Unité 5, 6 & 7 -->
<div class="unit-container">
    <div class="unit-header-box">
        <div class="unit-part-tag">Composante Chimie • Partie 3 & 4 : Évolution & Contrôle Organique (Total : 17 - 30 Heures)</div>
        <div class="unit-title">Sens d'Évolution, Piles, Électrolyse, Estérification & Saponification</div>
        <div class="unit-meta-bar">
            <span><strong>Durée :</strong> 17 - 30 Heures</span>
            <span><strong>Filières :</strong> PC, SVT, SM-A, SM-B</span>
        </div>
    </div>

    <div class="grid-two-col">
        <div class="info-card">
            <h4>📋 Prérequis Pédagogiques</h4>
            <ul>
                <li>Quotient de réaction Q_r et constante d'équilibre K.</li>
                <li>Réactions redox et définitions du courant électrique (I = Q / Δt).</li>
                <li>Groupes fonctionnels organiques : alcools, acides carboxyliques et nomenclature.</li>
            </ul>
        </div>
        <div class="info-card accent">
            <h4>❓ Situation-Problème & Questionnements</h4>
            <p>Les piles fournissent de l'énergie électrique par réactions redox spontanées, tandis que l'électrolyse recharge les batteries. En synthèse organique, comment prépare-t-on les arômes (esters) et fabrique-t-on le savon avec un excellent rendement ?</p>
        </div>
    </div>

    <div class="info-card" style="margin-bottom: 12px;">
        <h4>🎯 Compétences Visées & Objectifs d'Apprentissage</h4>
        <ul>
            <li>Appliquer le critère d'évolution spontanée : comparer Q_r,i et K pour prévoir le sens (sens direct si Q_r,i < K, inverse si Q_r,i > K).</li>
            <li>Comprendre les piles électrochimiques (pile Daniell) : identifier anode (oxydation), cathode (réduction), pont salin et calculer Q_max = I·Δt = n(e⁻)·F.</li>
            <li>Étudier les transformations forcées par électrolyse : oxydation anodique et réduction cathodique imposées par générateur ; calculer la masse déposée m = (I·Δt·M) / (n·F).</li>
            <li>Étudier l'estérification et l'hydrolyse : caractéristiques (lente, réversible, athermique, limitée), nomenclature des esters et méthodes d'amélioration du rendement.</li>
            <li>Maîtriser l'hydrolyse basique (saponification) : réaction totale avec NaOH, structure amphiphile des ions carboxylates et pouvoir nettoyant du savon.</li>
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
                    <strong>I. Critère d'Évolution Spontanée</strong>
                    <ul>
                        <li>1. Comparaison entre Q_r,i et K</li>
                        <li>2. Prévisions pour systèmes redox et acido-basiques</li>
                    </ul>
                    <strong>II. Piles Électrochimiques</strong>
                    <ul>
                        <li>1. Structure : pile Daniell, électrodes, pont salin</li>
                        <li>2. Oxydation à l'anode & réduction à la cathode</li>
                        <li>3. Capacité électrique Q_max = n(e⁻)·F = I·Δt_max</li>
                    </ul>
                    <strong>III. Transformations Forcées (Électrolyse)</strong>
                    <ul>
                        <li>1. Principe de la réaction forcée avec générateur</li>
                        <li>2. Applications industrielles (galvanoplastie, affinage du cuivre)</li>
                    </ul>
                    <strong>IV. Estérification & Hydrolyse</strong>
                    <ul>
                        <li>1. Équilibre réversible estérification-hydrolyse & rendement r</li>
                        <li>2. Déplacement de l'équilibre (réactif en excès, élimination de l'eau)</li>
                        <li>3. Synthèse totale par anhydride d'acide</li>
                    </ul>
                    <strong>V. Hydrolyse Basique (Saponification)</strong>
                    <ul>
                        <li>1. Équation de saponification (triglycéride + 3 NaOH → glycérol + 3 savons)</li>
                        <li>2. Caractère total & propriétés tensioactives du savon</li>
                    </ul>
                </td>
                <td>
                    <ul>
                        <li>Lames de Cuivre et de Zinc, pont salin (KNO₃ gélifié)</li>
                        <li>Solutions de CuSO₄ et ZnSO₄ (1 mol/L)</li>
                        <li>Ampèremètre, voltmètre, conducteur ohmique, fils</li>
                        <li>Tube en U pour électrolyse, électrodes de graphite, générateur continu</li>
                        <li>Montage de chauffage à reflux, ballons, pierre ponce</li>
                        <li>Réactifs : Éthanol, acide éthanoïque, anhydride éthanoïque, huile végétale, pastilles de NaOH, saumure saturée NaCl</li>
                    </ul>
                </td>
                <td>
                    <strong>Activité de l'Enseignant :</strong>
                    <ul>
                        <li>Réaliser la pile Daniell et mesurer la force électromotrice à vide.</li>
                        <li>Conduire l'électrolyse du chlorure de cuivre et faire observer le dépôt de cuivre.</li>
                        <li>Diriger la synthèse à reflux de l'acétate d'éthyle et le relargage du savon.</li>
                    </ul>
                    <strong>Activité de l'Apprenant :</strong>
                    <ul>
                        <li>Écrire les demi-équations aux électrodes et repérer les polarités.</li>
                        <li>Calculer la masse de cuivre déposée lors de l'électrolyse.</li>
                        <li>Fabriquer le savon, procéder au relargage dans la saumure et tester le pouvoir moussant.</li>
                    </ul>
                </td>
                <td>
                    <strong>Diagnostique :</strong>
                    <ul>
                        <li>Vérification des notions d'organique et de la constante de Faraday.</li>
                    </ul>
                    <strong>Formative :</strong>
                    <ul>
                        <li>Calculs de capacité de pile et évaluation du rendement d'estérification.</li>
                    </ul>
                    <strong>Sommative :</strong>
                    <ul>
                        <li>Problèmes complets d'examens nationaux en électrochimie et chimie organique.</li>
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

    en_html_path = os.path.join(out_dir, "2BAC_Physics_Chemistry_Lesson_Plans_English.html")
    fr_html_path = os.path.join(out_dir, "2BAC_Physique_Chimie_Fiches_Pedagogiques_Francais.html")

    en_pdf_path = os.path.join(out_dir, "2BAC_Physics_Chemistry_Lesson_Plans_English.pdf")
    fr_pdf_path = os.path.join(out_dir, "2BAC_Physique_Chimie_Fiches_Pedagogiques_Francais.pdf")

    print("Generating English HTML...")
    with open(en_html_path, "w", encoding="utf-8") as f:
        f.write(generate_english_html())

    print("Generating French HTML...")
    with open(fr_html_path, "w", encoding="utf-8") as f:
        f.write(generate_french_html())

    print("Compiling English PDF with Chromium...")
    cmd_en = [
        "/snap/bin/chromium",
        "--headless=new",
        "--disable-gpu",
        "--no-sandbox",
        f"--print-to-pdf={en_pdf_path}",
        f"file://{en_html_path}"
    ]
    subprocess.run(cmd_en, check=True)

    print("Compiling French PDF with Chromium...")
    cmd_fr = [
        "/snap/bin/chromium",
        "--headless=new",
        "--disable-gpu",
        "--no-sandbox",
        f"--print-to-pdf={fr_pdf_path}",
        f"file://{fr_html_path}"
    ]
    subprocess.run(cmd_fr, check=True)

    print(f"English PDF generated at: {en_pdf_path} ({os.path.getsize(en_pdf_path)} bytes)")
    print(f"French PDF generated at: {fr_pdf_path} ({os.path.getsize(fr_pdf_path)} bytes)")

if __name__ == "__main__":
    main()
