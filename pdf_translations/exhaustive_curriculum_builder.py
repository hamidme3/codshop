# -*- coding: utf-8 -*-
"""
Exhaustive Moroccan Curriculum Lesson Plans Generator (1-to-1 Page-by-Page)
- Common Core Sciences & Technology (TC - 13 pages)
- First Year Baccalaureate Sciences (1BAC - 18 pages)
- Second Year Baccalaureate Sciences (2BAC - 17 pages)
Author: Professor AYOUB KHAMMOUR (SOM: 1503811)
"""

import os
import subprocess

CSS_PAGE_STYLE = """
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

@page {
    size: A4 portrait;
    margin: 8mm 10mm 10mm 10mm;
}

* {
    box-sizing: border-box;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
}

body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: #0f172a;
    background: #ffffff;
    line-height: 1.35;
    font-size: 8pt;
    margin: 0;
    padding: 0;
}

.page {
    page-break-after: always;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.cover-page {
    page-break-after: always;
    height: 94vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    border: 3px double #0284c7;
    border-radius: 12px;
    padding: 30px;
    background: linear-gradient(135deg, #f8fafc 0%, #f0f9ff 100%);
}

.cover-title {
    font-size: 26pt;
    font-weight: 800;
    color: #0369a1;
    margin-bottom: 8px;
}

.cover-subtitle {
    font-size: 16pt;
    font-weight: 600;
    color: #0f172a;
    margin-bottom: 20px;
}

.cover-badge {
    display: inline-block;
    background: #0284c7;
    color: white;
    padding: 6px 20px;
    border-radius: 9999px;
    font-size: 11pt;
    font-weight: 600;
    margin-bottom: 30px;
    text-transform: uppercase;
}

.cover-author {
    font-size: 13pt;
    font-weight: 500;
    color: #334155;
    margin-top: 25px;
    padding-top: 15px;
    border-top: 1px solid #cbd5e1;
    width: 60%;
}

.cover-meta {
    margin-top: 20px;
    font-size: 9.5pt;
    color: #64748b;
}

/* Official Header */
.official-header {
    border: 1px solid #94a3b8;
    border-collapse: collapse;
    width: 100%;
    margin-bottom: 6px;
    font-size: 8pt;
}

.official-header td {
    border: 1px solid #94a3b8;
    padding: 3px 6px;
    text-align: center;
    font-weight: 600;
    background: #f8fafc;
}

.official-footer {
    border-top: 1px solid #94a3b8;
    display: flex;
    justify-content: space-between;
    font-size: 7pt;
    color: #64748b;
    padding-top: 3px;
    margin-top: 4px;
}

/* Overview Box */
.overview-box {
    border: 1px solid #cbd5e1;
    background: #f8fafc;
    border-radius: 4px;
    padding: 4px 8px;
    margin-bottom: 6px;
    font-size: 7.5pt;
}

.overview-title {
    font-weight: 700;
    color: #0369a1;
    margin-bottom: 3px;
    font-size: 8pt;
}

.overview-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6px;
}

/* Unit Sheet Block */
.unit-block {
    border: 1px solid #94a3b8;
    border-radius: 4px;
    margin-bottom: 6px;
    overflow: hidden;
}

.unit-banner {
    background: #0284c7;
    color: #ffffff;
    padding: 3px 8px;
    font-weight: 700;
    font-size: 8.5pt;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.unit-prereq-problem {
    display: grid;
    grid-template-columns: 1fr 1fr;
    border-bottom: 1px solid #cbd5e1;
    font-size: 7.5pt;
}

.prereq-col {
    padding: 4px 6px;
    border-right: 1px solid #cbd5e1;
    background: #ffffff;
}

.problem-col {
    padding: 4px 6px;
    background: #f0f9ff;
}

.block-title {
    font-weight: 700;
    color: #0369a1;
    margin-bottom: 2px;
}

/* Main Pedagogical Table */
.pedagogical-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 7.2pt;
}

.pedagogical-table th {
    background: #0f172a;
    color: #ffffff;
    font-weight: 600;
    padding: 4px 5px;
    border: 1px solid #64748b;
    text-align: left;
}

.pedagogical-table td {
    border: 1px solid #cbd5e1;
    padding: 4px 5px;
    vertical-align: top;
}

.pedagogical-table ul {
    margin: 0;
    padding-left: 12px;
}

.pedagogical-table li {
    margin-bottom: 2px;
}

.pedagogical-table tr:nth-child(even) td {
    background: #fafafa;
}
"""

def render_official_header(level, subject_comp, page_num, lang="en"):
    if lang == "en":
        return f"""
        <table class="official-header">
            <tr>
                <td style="width: 28%;">Level: {level}</td>
                <td style="width: 44%;">Subject: Physics-Chemistry • {subject_comp}</td>
                <td style="width: 28%;">Pedagogical Lesson Plans</td>
            </tr>
        </table>
        """
    else:
        return f"""
        <table class="official-header">
            <tr>
                <td style="width: 28%;">Niveau : {level}</td>
                <td style="width: 44%;">Matière : Physique-Chimie • {subject_comp}</td>
                <td style="width: 28%;">Fiches Pédagogiques</td>
            </tr>
        </table>
        """

def render_official_footer(page_num, lang="en"):
    if lang == "en":
        return f"""
        <div class="official-footer">
            <span>Professor: <strong>AYOUB KHAMMOUR</strong> (SOM: 1503811)</span>
            <span>References: Approved Textbooks – Pedagogical Orientations – Ministerial Memos 09-142 & 144</span>
            <span>Page {page_num}</span>
        </div>
        """
    else:
        return f"""
        <div class="official-footer">
            <span>Professeur : <strong>AYOUB KHAMMOUR</strong> (N° SOM : 1503811)</span>
            <span>Références : Manuels Agréés – Orientations Pédagogiques – Notes Ministérielles N° 09-142 & 144</span>
            <span>Page {page_num}</span>
        </div>
        """

print("Base layout helper defined successfully.")
