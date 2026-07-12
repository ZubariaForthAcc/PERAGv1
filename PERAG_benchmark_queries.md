# PERAG Benchmark Query Sets

All queries used in the PERAG evaluation dashboard, grouped by benchmark preset. 
Each preset is grounded in a real published RAG/KG-RAG benchmark or study; the query wording is adapted 
to the dashboard's fixed entity pool (8 drugs / 8 countries / 8 historical figures) rather than quoted verbatim from the original datasets.


---

## 🧬 Medical Domain — Drug Knowledge Graph


### 🎯 Narrow Therapeutic Index [Tacrolimus + Digoxin + Warfarin]

**Source:** Based on: KG-RAG SPOKE benchmark (Baranzini Lab, Bioinformatics 2024). LLM-only Llama-2: 44% on NTI MCQ. KG-RAG Llama-2: 71% (+61% relative). NTI drugs have the steepest parametric→RAG gap because exact thresholds, CYP isoforms, and P-gp interactions are not reliably memorised. Warfarin is included as the third FDA-recognised NTI drug alongside Tacrolimus and Digoxin, each requiring therapeutic drug monitoring (INR, trough levels) rather than fixed dosing.


**Queries (3):**

1. **Tacrolimus** — What are the critical drug interactions and contraindications for Tacrolimus, including CYP3A4 inhibitors/inducers and nephrotoxic combinations?
2. **Digoxin** — What are the known drug interactions, toxicity thresholds, and electrolyte effects that affect Digoxin safety?
3. **Warfarin** — What narrow-therapeutic-index concerns require INR monitoring for Warfarin, and which CYP2C9 inhibitors or inducers most destabilize its dosing?


### 🧬 Pharmacogenomics CYP [Clopidogrel + Warfarin + Simvastatin + Metformin]

**Source:** Based on: MIRAGE benchmark (Xiong et al., ACL Findings 2024); MedRAGChecker (2026). PGx questions show the largest LLM→RAG gap: LLMs misidentify activating enzymes (CYP2C19 vs CYP3A4 for clopidogrel) and confuse loss-of-function alleles (*2 vs *4). RAG with PubMed retrieval improves F1 by ~35pp on pharmacogenomics categories. CPIC guidelines extend the same gap beyond CYP enzymes: SLCO1B1 variants predict Simvastatin-associated myopathy risk, and OCT1/MATE1 transporter variants affect Metformin response — both routinely mis-stated by parametric-only LLMs.


**Queries (4):**

1. **Clopidogrel** — What are the pharmacogenomic factors (CYP2C19 alleles) and drug interactions that reduce Clopidogrel efficacy?
2. **Warfarin** — What are the known drug interactions and contraindications for Warfarin, including CYP2C9 inhibitors and vitamin K interactions?
3. **Simvastatin** — What SLCO1B1 genetic variants increase the risk of Simvastatin-associated myopathy, and how does this pharmacogenomic marker affect dosing guidance?
4. **Metformin** — What OCT1 and MATE1 transporter gene variants affect Metformin pharmacokinetics and glycemic response across different patient populations?


### 💊 Statin Safety Interactions [Simvastatin + Atorvastatin + Digoxin + Warfarin]

**Source:** Based on: MedHalt (Pal et al., CoNLL 2023); MIRAGE statin category. Statin DDIs (CYP3A4 inhibitors, dose caps, myopathy thresholds) are a frequent LLM failure — Simvastatin 80mg restriction, amiodarone cap at 20mg, and ciclosporin contraindication are routinely wrong without RAG. LLM-only accuracy ~42%; biomedical KG-RAG ~78%. Digoxin and Warfarin are included as the two most clinically significant statin co-prescriptions: statins raise Digoxin levels via P-glycoprotein transport and potentiate Warfarin's anticoagulant effect, both under-recognised without retrieval grounding.


**Queries (4):**

1. **Simvastatin** — What are the drug interactions and dose restrictions for Simvastatin, including CYP3A4 inhibitors, gemfibrozil, and ciclosporin?
2. **Atorvastatin** — What are the known drug interactions and contraindications for Atorvastatin?
3. **Digoxin** — How can co-administration of a statin alter Digoxin serum concentration via P-glycoprotein transport, and what monitoring is recommended?
4. **Warfarin** — How can concomitant statin therapy potentiate Warfarin's anticoagulant effect, and what INR monitoring adjustments are recommended?


### ⚠️ Full Contraindication Panel — 8 drugs

**Source:** Literature composite [MIRAGE 2024, KG-RAG SPOKE 2024, MedBioRAG 2024]. 300-query DDI/contraindication study pattern. LLM-only: 0.49–0.57 F1. KG-RAG (PubMed + ChEMBL): 0.87–0.94. Covers NTI, CYP, pregnancy, pediatric, and dose-threshold categories. KG-RAG provides the biggest gains on multi-source conflict queries where parametric memory averages conflicting values.


**Queries (8):**

1. **Tacrolimus** — What are the critical drug interactions and contraindications for Tacrolimus, including CYP3A4 inhibitors/inducers and nephrotoxic combinations?
2. **Digoxin** — What are the known drug interactions, toxicity thresholds, and electrolyte effects that affect Digoxin safety?
3. **Clopidogrel** — What are the pharmacogenomic factors (CYP2C19 alleles) and drug interactions that reduce Clopidogrel efficacy?
4. **Simvastatin** — What are the drug interactions and dose restrictions for Simvastatin, including CYP3A4 inhibitors, gemfibrozil, and ciclosporin?
5. **Warfarin** — What are the known drug interactions and contraindications for Warfarin, including CYP2C9 inhibitors and vitamin K interactions?
6. **Metformin** — What are the known drug interactions and contraindications for Metformin?
7. **Aspirin** — What are the known drug interactions and contraindications for Aspirin?
8. **Atorvastatin** — What are the known drug interactions and contraindications for Atorvastatin?


### 🔬 MedHalt — Hallucination Test [Pal et al., CoNLL 2023]

**Source:** MedHalt (Pal et al., CoNLL 2023): 1,000 MCQ medical questions from USMLE/NCLEX style. Tests False Confidence (FC) and Fabrication hallucinations. LLM-only: 43–62% depending on model. KG-augmented (SNOMED CT + DrugBank): 71–84%. Biggest gain on drug mechanism and contraindication categories (≥20pp). Expanded here to all 8 panel drugs to mirror MedHalt's MCQ/true-false question format across mechanism, threshold, and interaction sub-types.


**Queries (8):**

1. **Metformin** — What is the primary mechanism of action of Metformin and which patient populations require dose adjustment or contraindication based on renal function?
2. **Warfarin** — What are the pharmacokinetic drug interactions for Warfarin that require INR monitoring, and which CYP enzymes are responsible?
3. **Digoxin** — Explain the relationship between Digoxin toxicity, electrolyte imbalances, and the drugs that potentiate or reduce its toxicity.
4. **Clopidogrel** — What genetic variants affect Clopidogrel activation and what is the clinical consequence for patients who are CYP2C19 poor metabolisers?
5. **Aspirin** — True or false: Aspirin irreversibly inhibits COX-1, and which coadministered drugs most increase the risk of gastrointestinal bleeding?
6. **Atorvastatin** — Which statement about Atorvastatin drug interactions is correct, and what is the mechanism behind Atorvastatin-induced myopathy risk with CYP3A4 inhibitors?
7. **Tacrolimus** — True or false: Tacrolimus has a wide therapeutic index, and which drug classes most commonly precipitate Tacrolimus toxicity?
8. **Simvastatin** — What is the maximum recommended daily dose of Simvastatin when co-administered with amiodarone, and why was this restriction introduced?


### 🏥 MIRAGE — Biomedical RAG Benchmark [Xiong et al., ACL 2024]

**Source:** MIRAGE (Xiong et al., ACL Findings 2024): 5 datasets — MedQA-US, MedMCQA, PubMedQA, BioASQ-Y/N, MMLU-Med. LLM-only (Llama-3 70B): 67–72%. MedRAG (PubMed retrieval): 74–82%. KG-RAG with SPOKE or ChEMBL triples: 80–88% on drug interaction sub-tasks. Expanded to the full 8-drug panel to cover PubMedQA-style mechanism questions and BioASQ-style yes/no framing, where RAG improvement is most consistent (~8–15pp).


**Queries (8):**

1. **Aspirin** — What are the mechanisms by which Aspirin inhibits platelet aggregation and what drug interactions increase the risk of bleeding?
2. **Metformin** — What is the mechanism of Metformin-associated lactic acidosis and which patient conditions are associated with elevated risk?
3. **Atorvastatin** — How does Atorvastatin inhibit cholesterol synthesis and what drug interactions increase the risk of myopathy or rhabdomyolysis?
4. **Clopidogrel** — What are the drug interactions that reduce Clopidogrel efficacy and what alternative antiplatelet agents are recommended for poor metabolisers?
5. **Warfarin** — Is it true that Warfarin's anticoagulant effect is mediated through inhibition of vitamin K epoxide reductase, and which CYP2C9 polymorphisms alter dosing requirements?
6. **Digoxin** — What is the mechanism of Digoxin-induced cardiac glycoside toxicity and which electrolyte disturbances most increase this risk?
7. **Tacrolimus** — What is the mechanism of Tacrolimus-induced nephrotoxicity and which co-administered drugs increase serum Tacrolimus levels via CYP3A4 inhibition?
8. **Simvastatin** — What is the mechanism linking Simvastatin to rhabdomyolysis risk and which drug interactions most increase this risk?


### 🧠 KG-RAG SPOKE — Biomedical True/False + MCQ [Baranzini Lab 2024]

**Source:** KG-RAG with SPOKE KG (Baranzini Lab, Bioinformatics 2024). True/false biomedical claims: LLM-only 72% → KG-RAG 89% (+17pp). MCQ drug interactions: Llama-2 44% → KG-RAG Llama-2 71% (+61% relative improvement). GPT-3.5 56% → KG-RAG GPT-3.5 68%. Largest absolute gains on polypharmacy and narrow-therapeutic-index drug categories. Expanded to the full 8-drug panel, alternating true/false claims and MCQ-style prompts as used in the original SPOKE evaluation.


**Queries (8):**

1. **Tacrolimus** — What combination of drugs, when co-administered with Tacrolimus, significantly increases nephrotoxicity risk, and why?
2. **Digoxin** — Which electrolyte abnormalities potentiate Digoxin toxicity and what drugs cause those electrolyte shifts?
3. **Simvastatin** — Which drugs are absolutely contraindicated with Simvastatin due to rhabdomyolysis risk, and what is the pharmacokinetic basis?
4. **Warfarin** — What foods and herbal supplements interact with Warfarin via CYP2C9 or vitamin K pathways, and what INR changes are expected?
5. **Metformin** — True or false: Metformin is safe to continue prior to iodinated contrast administration regardless of renal function, and what is the correct guidance?
6. **Aspirin** — Which combination of Aspirin with another antiplatelet or anticoagulant drug produces the greatest increase in bleeding risk, and why?
7. **Clopidogrel** — True or false: omeprazole significantly reduces Clopidogrel's antiplatelet effect, and what is the pharmacokinetic mechanism?
8. **Atorvastatin** — Which drugs, when combined with Atorvastatin, are most strongly associated with rhabdomyolysis, and what is the shared pharmacokinetic pathway?


---

## 🌍 Geographic Domain — Wikidata / DBpedia


### 🌍 QALD-9 — DBpedia SPARQL QA [Perevalov et al. 2022]

**Source:** QALD-9 (Perevalov et al., ISWC 2022): 150 questions over DBpedia. LLM-only exact-match: 28–35%. SPARQL-based KG-RAG: 61% (from audit table in KGQAGen 2025). These geographic fact queries target the single-entity factoid category where KG-RAG shows clear improvement by grounding population, area, capital, and official language facts in structured Wikidata/DBpedia triples. Expanded to the full 8-country panel used across the PERAG geographic domain.


**Queries (8):**

1. **Germany** — What are the key geographic, demographic, and political facts about Germany, including population, area, capital, and federal structure?
2. **Brazil** — What are the key geographic, demographic, and political facts about Brazil, including area, population, capital city, and Amazon coverage?
3. **Japan** — What are the geographic, demographic, and economic facts about Japan, including land area, population size, and GDP ranking?
4. **Nigeria** — What are the key geographic, demographic, and political facts about Nigeria, including population, official languages, capital, and oil output?
5. **France** — What are the key geographic, demographic, and political facts about France, including population, capital, and government structure?
6. **India** — What are the key geographic, demographic, and political facts about India, including population, capital, and official languages?
7. **Canada** — What are the key geographic, demographic, and political facts about Canada, including area, population, and government structure?
8. **Egypt** — What are the key geographic, demographic, and political facts about Egypt, including population, capital, and official language?


### 📍 SimpleQA — Geographic Facts [OpenAI 2024]

**Source:** SimpleQA (OpenAI 2024): short-answer factual questions with a single unambiguous answer. MultiHal benchmark (Lavrinovics et al. 2025) shows KG-RAG (Wikidata-grounded) achieves consistent semantic score improvements across all tested LLMs on SimpleQA-derived geographic facts. LLM-only hallucination rate ~20–30% on capital, population, and area facts; KG-RAG reduces to ~5–8%. Expanded to the full 8-country panel, kept to SimpleQA's hallmark short, single-answer phrasing.


**Queries (8):**

1. **Germany** — What is the current population of Germany, what are its 16 federal states, and what is its total land area?
2. **Brazil** — What is the capital city of Brazil, when was it inaugurated, and what share of the Amazon rainforest does Brazil contain?
3. **Japan** — What is the capital of Japan and what is its current population?
4. **Nigeria** — What is the capital of Nigeria and what share of its export revenue comes from oil?
5. **France** — What is the capital of France and what is its total land area including overseas territories?
6. **India** — What is the capital of India and how many official regional languages does its constitution recognise?
7. **Canada** — What is the capital of Canada and what is its total land area?
8. **Egypt** — What is the capital of Egypt and what percentage of world shipping passes through the Suez Canal?


### 🗺️ LC-QuAD 2.0 — Complex Geographic QA [Dubey et al., ISWC 2019]

**Source:** LC-QuAD 2.0 (Dubey et al., ISWC 2019): 30,000 complex questions over Wikidata + DBpedia. LLM-only on multi-hop geographic queries: 18–25% F1. KG-RAG with SPARQL retrieval: 38–52% F1. The dataset's hybrid DBpedia/Wikidata structure makes it ideal for testing federated provenance across conflicting sources — the core PERAG scenario. Expanded to the full 8-country panel, keeping the multi-hop reasoning subset's compositional question structure.


**Queries (8):**

1. **Germany** — What is the relationship between Germany's federal structure, its GDP per capita, and its climate commitments compared to other G7 nations?
2. **Japan** — How does Japan's population distribution across its four main islands relate to its economic output and demographic aging trends?
3. **Nigeria** — How does Nigeria's oil production output relate to its population size and its share of African continental GDP?
4. **Brazil** — What is the relationship between Brazil's Amazon forest coverage, its carbon commitments, and its agricultural economic output?
5. **France** — What is the relationship between France's status as a Fifth Republic and its permanent seat on the UN Security Council compared to other EU founding members?
6. **India** — How does India's population overtaking China in 2023 relate to its federal language policy and its number of recognised official languages?
7. **Canada** — How does Canada's land area and G7 membership relate to its bilingual federal policy compared to other G7 nations?
8. **Egypt** — How does Egypt's control of the Suez Canal relate to its GDP and regional trade role compared to other African economies?


### 🌐 MultiHal — KG-Grounded Hallucination Eval [Lavrinovics et al., 2025]

**Source:** MultiHal (Lavrinovics et al., arXiv 2505.14101, 2025): multilingual KG-grounded hallucination benchmark using Wikidata/DBpedia triples. Covers SimpleQA, HaluEval, Defan and Shroom2024 subsets. KG-RAG shows consistent semantic score improvement across ALL tested LLMs. Best gains on single-entity unambiguous questions with numeric facts (population, area, date). Expanded to the full 8-country panel, replicating the highest-gain single-entity geographic subset.


**Queries (8):**

1. **Germany** — What is Germany's total land area in km², its current population, and in what year was Berlin designated as the reunified capital?
2. **Japan** — What is Japan's total land area, current population, what share is aged 65 or over, and what is Japan's GDP ranking in Asia?
3. **Nigeria** — What is Nigeria's population, land area, capital city, and what year did Abuja officially replace Lagos as the capital?
4. **Brazil** — What is Brazil's land area, population, capital city, and what share of the Amazon rainforest does Brazil contain?
5. **France** — What is France's total land area including overseas territories, its current population, and in what year was the Fifth Republic established?
6. **India** — What is India's total land area, current population, and in what year did it surpass China as the world's most populous country?
7. **Canada** — What is Canada's total land area, current population, and what year did it join NATO as a founding member?
8. **Egypt** — What is Egypt's current population, total land area, and what percentage of global trade passes through the Suez Canal?


---

## 📚 General Knowledge Domain — FedBench / Wikidata


### 🔥 HotpotQA — Multi-hop Reasoning [Yang et al., EMNLP 2018]

**Source:** HotpotQA (Yang et al., EMNLP 2018): multi-hop QA requiring ≥2 Wikipedia documents. LLM-only EM: 0.102 (Naive LLM, KG-Retriever 2024). RAG baseline: 0.236–0.282 EM. KG-guided RAG: 0.350–0.450 EM. KG²RAG (arXiv 2502.06864): >29% F1 improvement over LLM-only. KAG framework (arXiv 2409.13731): +12.5% F1 over best RAG baseline. Expanded to the full 8-figure panel, keeping the bridge-type multi-hop subset where KG structure provides the clearest advantage.


**Queries (8):**

1. **Albert Einstein** — What were the key scientific contributions of Albert Einstein and at which institutions did he work after emigrating to the United States?
2. **Marie Curie** — What were Marie Curie's major scientific discoveries, what Nobel Prizes did she receive, and what research institutions did she found?
3. **Nikola Tesla** — What were Nikola Tesla's key contributions to alternating current technology and at which companies did he work after emigrating to the United States?
4. **Charles Darwin** — What theory did Charles Darwin develop after his voyage on HMS Beagle, and what book did he publish presenting this theory?
5. **Isaac Newton** — What laws did Isaac Newton formulate in the Principia Mathematica, and what position did he later hold at the Royal Mint?
6. **Ada Lovelace** — What collaboration did Ada Lovelace have with Charles Babbage, and what is she considered the first person to have written?
7. **Leonardo da Vinci** — What famous paintings did Leonardo da Vinci create, and in which Italian city did he paint the Last Supper?
8. **Rosalind Franklin** — What X-ray diffraction image did Rosalind Franklin produce at King's College London, and how did it contribute to the discovery of the structure of DNA?


### 🧩 MuSiQue — Compositional Multi-hop [Trivedi et al., TACL 2022]

**Source:** MuSiQue (Trivedi et al., TACL 2022): 2-4 hop compositional questions designed to resist shortcut reasoning. LLM-only EM: 0.040. BM25 RAG: 0.070. KG-CQR (arXiv 2508.20417): F1 0.489 vs 0.374 for BM25 (+31% relative). KAG framework: +10.5% EM, +12.2% F1 over best prior RAG. Expanded to the full 8-figure panel; each query still requires chaining ≥2 facts — the scenario where KG provenance chains are most valuable for PERAG.


**Queries (8):**

1. **Albert Einstein** — At which university did Albert Einstein work when he published his most famous theory, and what country did he emigrate to before joining that institution?
2. **Marie Curie** — What radioactive element did Marie Curie discover that was named after her home country, and what was the name of the institute she later founded in that country?
3. **Nikola Tesla** — In what year was Nikola Tesla born, and what invention did he develop that later became the standard for power distribution in the country he emigrated to?
4. **Charles Darwin** — What ship did Charles Darwin sail on for his research voyage, and what theory did he publish years after that voyage ended?
5. **Isaac Newton** — What academic chair did Isaac Newton hold at Cambridge, and what major work did he publish while holding that position?
6. **Ada Lovelace** — Who was Ada Lovelace's father, and what machine did she write an algorithm for in collaboration with Charles Babbage?
7. **Leonardo da Vinci** — In what town was Leonardo da Vinci born, and in what French residence did he spend his final years after leaving Italy?
8. **Rosalind Franklin** — At what institution did Rosalind Franklin capture Photograph 51, and from what illness did she later die?


### ✅ KGQAGen-10k — Wikidata Verified QA [Jain et al., 2025]

**Source:** KGQAGen-10k (Jain et al., arXiv 2505.23495, 2025): 10,000 Wikidata-grounded questions with verified ground truth (addressing the 57% correctness problem of WebQSP/CWQ). LLM-only average: 38–48% on compositional multi-hop subset. KG-RAG with Wikidata SPARQL: 61–72%. Best for testing provenance across federated Wikidata+DBpedia sources — the canonical PERAG federated scenario. Expanded to the full 8-figure panel of the two-hop Wikidata-answerable subset.


**Queries (8):**

1. **Albert Einstein** — In what year did Albert Einstein receive the Nobel Prize in Physics, what was the official reason given, and in which city was the ceremony held?
2. **Marie Curie** — How many Nobel Prizes did Marie Curie receive, in which scientific fields, and who were her co-recipients for each prize?
3. **Nikola Tesla** — In what year did Nikola Tesla die, in what city did he die, and what was his nationality at birth?
4. **Charles Darwin** — In what year did Charles Darwin die, and where is he buried?
5. **Isaac Newton** — In what year was Isaac Newton born, and in what English town was he born?
6. **Ada Lovelace** — In what year did Ada Lovelace publish her notes on the Analytical Engine, and who was the engine's inventor?
7. **Leonardo da Vinci** — In what year did Leonardo da Vinci die, and in what country did he spend his final years?
8. **Rosalind Franklin** — In what year was Rosalind Franklin born, and in what year did she die?


### 📋 Defan — Definitive Answer Hallucination Eval [Rahman et al., 2024]

**Source:** Defan (Rahman et al., arXiv 2406.09155, 2024): 1,000 questions with single unambiguous answers designed to expose LLM hallucination. MultiHal benchmark (2025) shows Defan achieves the highest KG-RAG improvement rates (~95% of samples show improvement). LLM-only false-positive hallucination: 18–35%. KG-RAG (Wikidata): reduces to 4–9%. Expanded to the full 8-figure panel, replicating the definitive single-answer category.


**Queries (8):**

1. **Albert Einstein** — Where was Albert Einstein born, on what exact date, and what was his father's profession at the time?
2. **Marie Curie** — On what date did Marie Curie die, from what illness, and in what city did she spend her final years working?
3. **Nikola Tesla** — Where was Nikola Tesla born, on what exact date, and what was his father's profession?
4. **Charles Darwin** — On what exact date was Charles Darwin born, and in what English town?
5. **Isaac Newton** — On what exact date was Isaac Newton born, and in what hamlet was he born?
6. **Ada Lovelace** — On what exact date did Ada Lovelace die, and at what age?
7. **Leonardo da Vinci** — On what exact date did Leonardo da Vinci die, and in what French town?
8. **Rosalind Franklin** — On what exact date did Rosalind Franklin die, and from what illness?


### 📚 General Full Panel — 8 entities [HotpotQA + MuSiQue + KGQAGen pattern]

**Source:** Composite panel across HotpotQA (Yang et al. 2018), MuSiQue (Trivedi et al. 2022), and KGQAGen-10k (Jain et al. 2025). KG-RAG shows consistent improvement over LLM-only across all three benchmarks. Largest gains on multi-hop queries (≥2 reasoning steps) where parametric memory fails to chain facts reliably. Average LLM-only F1: 0.20–0.35. KG-RAG: 0.45–0.66. Expanded to the full 8-figure panel spanning the entire PERAG general-knowledge entity set.


**Queries (8):**

1. **Albert Einstein** — What are the key biographical facts about Albert Einstein including birthplace, Nobel Prize year, cause of death, and post-emigration institutions?
2. **Marie Curie** — What are the key biographical and scientific facts about Marie Curie including discoveries, Nobel Prizes, institutes founded, and cause of death?
3. **Nikola Tesla** — What are the key biographical and scientific facts about Nikola Tesla including birthplace, major inventions, and year of death?
4. **Charles Darwin** — What are the key biographical and scientific facts about Charles Darwin including his voyage, major theory, and place of burial?
5. **Isaac Newton** — What are the key biographical and scientific facts about Isaac Newton including birth date, major publications, and later career?
6. **Ada Lovelace** — What are the key biographical and scientific facts about Ada Lovelace including her collaborators, major contribution, and cause of death?
7. **Leonardo da Vinci** — What are the key biographical and scientific facts about Leonardo da Vinci including birthplace, major works, and place of death?
8. **Rosalind Franklin** — What are the key biographical and scientific facts about Rosalind Franklin including her major discovery, institution, and cause of death?
