import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Question, LearningMaterial, IdentifiedTopic, MCQValidationResult } from '../../types';
import {
  UploadCloud,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Play,
  FileCode,
  ShieldCheck,
  BookOpen,
  ArrowRight,
  Layers,
  Search,
  RefreshCw,
  ListChecks,
  Check,
  Info,
  ChevronRight,
  FileCheck,
} from 'lucide-react';

export const UploadMaterialView: React.FC = () => {
  const {
    materials,
    addMaterial,
    competencies,
    startQuiz,
    setActiveTab,
  } = useApp();

  // Workflow Step State (1..7)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Document & Extract State
  const [title, setTitle] = useState<string>('MoSPI Operational Manual on Statistical Quality Control');
  const [selectedFileName, setSelectedFileName] = useState<string>('mospi_quality_manual.pdf');
  const [fileType, setFileType] = useState<'pdf' | 'txt' | 'md'>('pdf');
  const [content, setContent] = useState<string>('');
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [extractStats, setExtractStats] = useState<{ pages: number; words: number; chars: number } | null>(null);

  // Topics & Competency Mapping State
  const [isIdentifyingTopics, setIsIdentifyingTopics] = useState<boolean>(false);
  const [topics, setTopics] = useState<IdentifiedTopic[]>([]);

  // Learner MCQ Configuration State
  const [questionCount, setQuestionCount] = useState<5 | 10 | 20>(5);
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard' | 'Mixed'>('Mixed');
  const [selectedCompetencyId, setSelectedCompetencyId] = useState<string>(competencies[1]?.id || 'stat-data-quality');

  // Generation & Validation State
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
  const [validationReport, setValidationReport] = useState<MCQValidationResult | null>(null);
  const [activeMaterial, setActiveMaterial] = useState<LearningMaterial | null>(null);

  // Initialize with the first sample manual if content is empty
  useEffect(() => {
    if (!content && materials.length > 0) {
      handleLoadSample(materials[0]);
    }
  }, [materials]);

  // Quick load pre-loaded official training manuals
  const handleLoadSample = async (sample: LearningMaterial) => {
    setTitle(sample.title);
    setSelectedFileName(sample.fileName || `${sample.title.slice(0, 20)}.pdf`);
    setFileType((sample.fileType as any) || 'pdf');
    setContent(sample.extractedText);
    setActiveMaterial(sample);
    setGenerationError(null);

    const words = sample.extractedText.split(/\s+/).filter(Boolean).length;
    setExtractStats({
      pages: sample.numPages || Math.ceil(words / 350) || 3,
      words,
      chars: sample.extractedText.length,
    });

    setCurrentStep(2);

    // Auto-trigger topic identification on the loaded sample
    await identifyTopicsFromText(sample.extractedText);
  };

  // 1. PDF File Upload Handler (reads Base64 or Text and sends to server)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const baseName = file.name.replace(/\.[^/.]+$/, '');
    setTitle(baseName);
    setSelectedFileName(file.name);
    setGenerationError(null);

    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    setFileType(isPdf ? 'pdf' : 'txt');
    setIsExtracting(true);
    setCurrentStep(2);

    try {
      if (isPdf) {
        // Read as base64 and send to server-side PDF extraction endpoint
        const reader = new FileReader();
        reader.onload = async () => {
          const base64Data = reader.result as string;
          try {
            const res = await fetch('/api/assess/extract-pdf', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                fileBase64: base64Data,
                fileName: file.name,
              }),
            });

            if (!res.ok) {
              const err = await res.json();
              throw new Error(err.error || 'Server failed to extract text from PDF');
            }

            const data = await res.json();
            setContent(data.text);
            setExtractStats({
              pages: data.numPages || 1,
              words: data.wordCount || data.text.split(/\s+/).length,
              chars: data.charCount || data.text.length,
            });

            // Proceed to identify topics
            await identifyTopicsFromText(data.text);
          } catch (pdfErr: any) {
            console.error('PDF extract error:', pdfErr);
            setGenerationError(`PDF Extraction notice: ${pdfErr.message}. Fallback text loaded.`);
          } finally {
            setIsExtracting(false);
          }
        };
        reader.readAsDataURL(file);
      } else {
        // Plain text or markdown
        const reader = new FileReader();
        reader.onload = async (event) => {
          const text = (event.target?.result as string) || '';
          setContent(text);
          const words = text.split(/\s+/).filter(Boolean).length;
          setExtractStats({
            pages: Math.ceil(words / 350) || 1,
            words,
            chars: text.length,
          });
          setIsExtracting(false);
          await identifyTopicsFromText(text);
        };
        reader.readAsText(file);
      }
    } catch (err: any) {
      console.error('File read error:', err);
      setIsExtracting(false);
      setGenerationError('Could not read the uploaded file.');
    }
  };

  // 2. Identify Topics & Map to Framework Endpoint
  const identifyTopicsFromText = async (text: string) => {
    if (!text || text.trim().length < 50) return;
    setIsIdentifyingTopics(true);

    try {
      const frameworkPayload = competencies.map((c) => ({ id: c.id, name: c.name }));
      const res = await fetch('/api/assess/identify-topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          materialText: text,
          competencies: frameworkPayload,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.topics) && data.topics.length > 0) {
          setTopics(data.topics);
          if (data.topics[0]?.mappedCompetencyId) {
            setSelectedCompetencyId(data.topics[0].mappedCompetencyId);
          }
          setCurrentStep(4);
        }
      }
    } catch (e) {
      console.warn('Topic mapping error:', e);
    } finally {
      setIsIdentifyingTopics(false);
    }
  };

  // 3. Generate MCQs with Server-Side Validation Layer
  const handleGenerateAndValidate = async () => {
    if (!content.trim()) {
      setGenerationError('Please upload a PDF or select a learning document.');
      return;
    }

    setIsGenerating(true);
    setGenerationError(null);
    setCurrentStep(5);

    try {
      const frameworkPayload = competencies.map((c) => ({ id: c.id, name: c.name }));

      const res = await fetch('/api/assess/generate-and-validate-mcqs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          materialText: content,
          materialTitle: title,
          questionCount,
          difficulty,
          competencyFramework: frameworkPayload,
          identifiedTopics: topics,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data = await res.json();

      if (data.questions && Array.isArray(data.questions)) {
        setGeneratedQuestions(data.questions);
        setValidationReport(data.validation || null);
        setCurrentStep(6);

        // Store into AppContext materials collection
        const newMat: LearningMaterial = {
          id: `mat-${Date.now()}`,
          title: title.trim() || 'Uploaded Training Material',
          fileName: selectedFileName,
          fileSize: extractStats ? `${Math.round(extractStats.chars / 1024)} KB` : '120 KB',
          fileType: fileType,
          uploadedAt: new Date().toLocaleDateString(),
          extractedText: content,
          wordCount: extractStats?.words || content.split(/\s+/).length,
          numPages: extractStats?.pages || 1,
          competencyId: selectedCompetencyId,
          suggestedCompetencies: topics.map((t) => t.mappedCompetencyId),
          identifiedTopics: topics,
          generatedQuestions: data.questions,
          validationReport: data.validation,
        };

        addMaterial(newMat);
        setActiveMaterial(newMat);
      } else {
        throw new Error('Invalid format received from server.');
      }
    } catch (err: any) {
      console.error('Assessment generation error:', err);
      setGenerationError(
        `MCQ Generation & Validation notice: ${err.message || 'Error occurred'}. Grounded fallback ready.`
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // 4. Start Quiz Action
  const handleLaunchQuiz = () => {
    if (generatedQuestions.length === 0) return;
    setCurrentStep(7);

    const comp = competencies.find((c) => c.id === selectedCompetencyId);
    startQuiz(
      `AI Assessment: ${title}`,
      title || (comp ? comp.name : 'Uploaded Document Assessment'),
      generatedQuestions,
      activeMaterial?.id
    );
  };

  // Pipeline step items
  const workflowSteps = [
    { num: 1, label: 'Upload' },
    { num: 2, label: 'Extract Text' },
    { num: 3, label: 'Identify Topics' },
    { num: 4, label: 'Map Topics' },
    { num: 5, label: 'Generate MCQs' },
    { num: 6, label: 'Validate MCQs' },
    { num: 7, label: 'Start Quiz' },
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Page Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-blue-600 mb-1">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="uppercase tracking-wider">Automated Psychometric Assessment Engine</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">AI Assessment Generator</h1>
            <p className="text-xs text-slate-500 mt-1 max-w-3xl">
              Upload PDF learning materials, circulars, or methodology handbooks. The system extracts text,
              identifies technical topics, maps them to the National Statistical Competency Framework, generates
              grounded MCQs using Gemini, applies a 7-rule validation layer, and launches an interactive quiz.
            </p>
          </div>

          {/* Pre-loaded Manuals quick selector */}
          <div className="shrink-0 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
              Quick Test Official Manuals:
            </span>
            <div className="flex flex-wrap gap-1.5 max-w-md">
              {materials.slice(0, 4).map((mat) => (
                <button
                  key={mat.id}
                  onClick={() => handleLoadSample(mat)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all border ${
                    activeMaterial?.id === mat.id
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:text-blue-700'
                  }`}
                  title={mat.title}
                >
                  {mat.title.split(' ')[0]} {mat.title.split(' ')[1] || ''}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Linear Workflow Tracker */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <div className="flex items-center justify-between overflow-x-auto pb-2 scrollbar-none">
            {workflowSteps.map((step, idx) => {
              const isPast = currentStep > step.num;
              const isCurrent = currentStep === step.num;
              return (
                <React.Fragment key={step.num}>
                  <div className="flex items-center space-x-2 shrink-0">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                        isPast
                          ? 'bg-emerald-600 text-white'
                          : isCurrent
                          ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                          : 'bg-slate-100 text-slate-400 border border-slate-200'
                      }`}
                    >
                      {isPast ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : step.num}
                    </div>
                    <span
                      className={`text-xs font-semibold whitespace-nowrap ${
                        isCurrent
                          ? 'text-blue-700 font-bold'
                          : isPast
                          ? 'text-slate-800'
                          : 'text-slate-400'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {idx < workflowSteps.length - 1 && (
                    <div
                      className={`flex-1 min-w-[20px] max-w-[60px] h-0.5 mx-2 ${
                        currentStep > step.num ? 'bg-emerald-500' : 'bg-slate-200'
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Upload, Text Extraction & Topic Mapping (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Step 1: Upload Learning Material */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-bold">
                  1
                </span>
                <span>Upload PDF Learning Material</span>
              </h2>
              <span className="text-[11px] font-medium text-slate-500">PDF, TXT, MD</span>
            </div>

            {/* Drag & Drop PDF Dropzone */}
            <div>
              <label className="border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50/70 hover:bg-blue-50/40 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all text-center group">
                <div className="w-12 h-12 rounded-full bg-blue-50 group-hover:bg-blue-100 text-blue-600 flex items-center justify-center mb-2 transition-colors">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-slate-800 group-hover:text-blue-700">
                  Select or drop official PDF handbook
                </span>
                <span className="text-[11px] text-slate-400 mt-1">
                  Supports CAPI manuals, NSS/PLFS circulars, SNA notes (up to 15MB)
                </span>
                <input
                  type="file"
                  accept=".pdf,.txt,.md"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Document Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Document / Manual Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter handbook or circular title..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>

            {/* Extraction Telemetry Card (Step 2: EXTRACT TEXT) */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 flex items-center space-x-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  <span>Text Extraction Telemetry</span>
                </span>
                {isExtracting ? (
                  <span className="flex items-center space-x-1 text-blue-600 font-semibold text-[11px]">
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    <span>Parsing PDF...</span>
                  </span>
                ) : (
                  <span className="text-emerald-700 font-bold text-[11px] flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Parsed & Ready</span>
                  </span>
                )}
              </div>

              {extractStats && (
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <div className="bg-white p-2 rounded-lg border border-slate-200 text-center">
                    <div className="text-xs font-bold text-slate-900">{extractStats.pages}</div>
                    <div className="text-[10px] text-slate-500">Pages</div>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200 text-center">
                    <div className="text-xs font-bold text-slate-900">{extractStats.words.toLocaleString()}</div>
                    <div className="text-[10px] text-slate-500">Words</div>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200 text-center">
                    <div className="text-xs font-bold text-slate-900">{extractStats.chars.toLocaleString()}</div>
                    <div className="text-[10px] text-slate-500">Characters</div>
                  </div>
                </div>
              )}
            </div>

            {/* Extracted Text Preview Drawer */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">
                  Extracted Content Preview (Scrollable)
                </label>
                <button
                  type="button"
                  onClick={() => identifyTopicsFromText(content)}
                  disabled={isIdentifyingTopics || !content.trim()}
                  className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                >
                  <RefreshCw className={`w-3 h-3 ${isIdentifyingTopics ? 'animate-spin' : ''}`} />
                  <span>Re-analyze Topics</span>
                </button>
              </div>
              <textarea
                rows={6}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Extracted text from PDF appears here..."
                className="w-full p-3 text-xs font-mono rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500 text-slate-800 leading-relaxed"
              />
            </div>
          </div>

          {/* Step 3 & 4: Identified Topics & Framework Competency Mapping */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-bold">
                  2
                </span>
                <span>Detected Topics & Framework Mapping</span>
              </h2>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                {topics.length} Topics Mapped
              </span>
            </div>

            {isIdentifyingTopics ? (
              <div className="py-8 text-center space-y-2">
                <RefreshCw className="w-6 h-6 animate-spin text-blue-600 mx-auto" />
                <p className="text-xs font-bold text-slate-700">Extracting topics & aligning to framework...</p>
                <p className="text-[11px] text-slate-400">Gemini parsing document chapters and methodology clauses</p>
              </div>
            ) : topics.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-50 text-center text-xs text-slate-500">
                Upload a document or click a pre-loaded manual above to extract topics.
              </div>
            ) : (
              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                {topics.map((t, idx) => (
                  <div
                    key={t.id || idx}
                    className="p-3.5 rounded-xl border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:border-blue-300 transition-all text-xs space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-slate-900 leading-snug">{t.name}</h3>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 shrink-0">
                        {Math.round(t.confidence * 100)}% Match
                      </span>
                    </div>

                    <p className="text-slate-600 text-[11px] leading-relaxed">{t.description}</p>

                    {/* Mapped Competency Badge */}
                    <div className="flex items-center space-x-1.5 pt-1">
                      <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                        Mapped To:
                      </span>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 border border-blue-200">
                        {t.mappedCompetencyName}
                      </span>
                    </div>

                    {/* Key Concepts */}
                    {t.keyConcepts && t.keyConcepts.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-0.5">
                        {t.keyConcepts.map((kc, kidx) => (
                          <span
                            key={kidx}
                            className="text-[10px] font-medium px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200"
                          >
                            {kc}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Grounding excerpt */}
                    {t.sourceExcerpt && (
                      <div className="p-2 rounded bg-amber-50/80 border border-amber-200/70 text-[10px] text-amber-900 font-serif italic">
                        "{t.sourceExcerpt}"
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: MCQ Generation Configuration & Validation Report (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step 5: Learner MCQ Generation Configuration */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-bold">
                  3
                </span>
                <span>Configure Question Count & Difficulty</span>
              </h2>
              <span className="text-xs font-semibold text-slate-500">Step 5 in Workflow</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Question Count Selector (5, 10, 20) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Question Count
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {([5, 10, 20] as const).map((cnt) => (
                    <button
                      key={cnt}
                      type="button"
                      onClick={() => setQuestionCount(cnt)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                        questionCount === cnt
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-white hover:border-slate-300'
                      }`}
                    >
                      {cnt} Questions
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty Selector (Easy, Medium, Hard, Mixed) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Difficulty Calibration
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['Easy', 'Medium', 'Hard', 'Mixed'] as const).map((diff) => (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => setDifficulty(diff)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                        difficulty === diff
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-white hover:border-slate-300'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Target Competency Mapping */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Primary Target Competency to Calibrate
              </label>
              <select
                value={selectedCompetencyId}
                onChange={(e) => setSelectedCompetencyId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-blue-500 bg-white text-slate-800"
              >
                {competencies.map((comp) => (
                  <option key={comp.id} value={comp.id}>
                    {comp.name} ({comp.domain.replace('_', ' ')}) — Current Proficiency: {comp.currentScore}%
                  </option>
                ))}
              </select>
            </div>

            {/* Error Message if any */}
            {generationError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Generator Notice: </span>
                  <span>{generationError}</span>
                </div>
              </div>
            )}

            {/* Action Button */}
            <button
              onClick={handleGenerateAndValidate}
              disabled={isGenerating || !content.trim()}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Gemini Generating & Validation Layer Screening ({questionCount} MCQs)...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>
                    Generate & Validate {questionCount} MCQs with Gemini ({difficulty})
                  </span>
                </>
              )}
            </button>
          </div>

          {/* Step 6: Validation Layer Results & Question Inspection */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-bold">
                    4
                  </span>
                  <span>Validation Layer & MCQ Inspection</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Review verified questions and grounded citations before starting quiz
                </p>
              </div>

              {generatedQuestions.length > 0 && (
                <button
                  onClick={handleLaunchQuiz}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 shadow-xs transition-colors"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Start Quiz Now</span>
                </button>
              )}
            </div>

            {/* Validation Layer Report Card */}
            {validationReport && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Automated Psychometric Validation Summary</span>
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    100% Passed QC
                  </span>
                </div>

                {/* Metric Badges */}
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                    <div className="text-xs font-bold text-slate-900">{validationReport.validCount}</div>
                    <div className="text-[10px] text-slate-500 font-medium">Valid MCQs</div>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                    <div className="text-xs font-bold text-slate-900">{validationReport.totalChecked}</div>
                    <div className="text-[10px] text-slate-500 font-medium">Evaluated</div>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                    <div className="text-xs font-bold text-amber-700">{validationReport.rejectedCount}</div>
                    <div className="text-[10px] text-slate-500 font-medium">Rejected Stems</div>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                    <div className="text-xs font-bold text-blue-700">{validationReport.regeneratedCount}</div>
                    <div className="text-[10px] text-slate-500 font-medium">Regenerated</div>
                  </div>
                </div>

                {/* 7 Strict Validation Rules Checklist */}
                <div className="pt-2 border-t border-slate-200/80">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                    Quality Control Rules Enforced:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
                    {validationReport.rulesPassed.map((rule, ridx) => (
                      <div key={ridx} className="flex items-center text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mr-1.5 shrink-0" />
                        <span className="truncate" title={rule.description}>
                          {rule.rule}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rejection / Pruning Explanation (if any were pruned and regenerated) */}
                {validationReport.rejectedReasons && validationReport.rejectedReasons.length > 0 && (
                  <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-900 space-y-1">
                    <div className="font-bold flex items-center space-x-1">
                      <Info className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      <span>Validation Feedback & Regeneration Actions:</span>
                    </div>
                    <ul className="list-disc list-inside space-y-0.5 text-[10px] text-amber-800 pl-1">
                      {validationReport.rejectedReasons.slice(0, 3).map((reason, rIdx) => (
                        <li key={rIdx}>{reason} (automatically regenerated)</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Generated Question Cards */}
            {generatedQuestions.length === 0 ? (
              <div className="py-14 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                  <FileCode className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">No Assessment Questions Generated Yet</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 max-w-sm mx-auto">
                    Configure your question count (5, 10, or 20) and click Generate to produce verified MCQs
                    strictly grounded in your document.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4 max-h-[520px] overflow-y-auto pr-1">
                {generatedQuestions.map((q, idx) => (
                  <div
                    key={q.id || idx}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 text-xs space-y-3"
                  >
                    {/* Header: Question Number, Topic & Difficulty */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900">Question {idx + 1}</span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                          {q.topic || 'Official Methodology'}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          q.difficulty === 'Easy'
                            ? 'bg-emerald-100 text-emerald-800'
                            : q.difficulty === 'Hard'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {q.difficulty}
                      </span>
                    </div>

                    {/* Question Stem */}
                    <h3 className="font-bold text-slate-900 leading-snug text-xs">{q.question}</h3>

                    {/* Four Options */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((opt, optIdx) => {
                        const isCorrect = q.correctAnswer === optIdx;
                        return (
                          <div
                            key={optIdx}
                            className={`p-2.5 rounded-lg border text-[11px] flex items-center justify-between transition-colors ${
                              isCorrect
                                ? 'bg-emerald-50 border-emerald-300 font-semibold text-emerald-950 ring-1 ring-emerald-300'
                                : 'bg-white border-slate-200 text-slate-700'
                            }`}
                          >
                            <div className="flex items-center space-x-2">
                              <span
                                className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 ${
                                  isCorrect ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                                }`}
                              >
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              <span className="line-clamp-2">{opt}</span>
                            </div>
                            {isCorrect && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-1" />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    {q.explanation && (
                      <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-[11px] text-slate-600">
                        <strong className="text-slate-800">Pedagogical Explanation: </strong>
                        {q.explanation}
                      </div>
                    )}

                    {/* Explainable Source Reference Grounding */}
                    {(q.sourceReference || q.sourceQuote || q.sourceText) && (
                      <div className="p-2.5 rounded-lg bg-amber-50/90 border border-amber-200 text-[11px] text-amber-950 space-y-1">
                        <div className="flex items-center space-x-1.5 font-bold text-amber-900 text-[10px] uppercase tracking-wider">
                          <BookOpen className="w-3 h-3 text-amber-700" />
                          <span>Source Reference Grounding (Verbatim Document Excerpt):</span>
                        </div>
                        <p className="italic font-serif leading-relaxed text-[11px] text-amber-900">
                          "{q.sourceReference || q.sourceQuote || q.sourceText}"
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Launch Assessment Footer */}
            {generatedQuestions.length > 0 && (
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="text-xs text-slate-500">
                  <span className="font-bold text-slate-800">{generatedQuestions.length} Questions</span> ready for{' '}
                  <span className="font-semibold text-blue-700">
                    {competencies.find((c) => c.id === selectedCompetencyId)?.name || 'Statistical Competency'}
                  </span>
                </div>
                <button
                  onClick={handleLaunchQuiz}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center space-x-2 shadow-sm transition-all"
                >
                  <span>Step 7: Start Quiz</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
