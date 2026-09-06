import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Save } from 'lucide-react';
import {
  PageBuilderReact,
  type PageBuilderDesign,
} from '@mindfiredigital/page-builder-react';
import { pagesApi } from '../api/pages.api';
import { usePageSchema } from '../hooks/usePageSchema';

// Custom page-builder components
import HeroSection from '../components/page-builder/components/HeroSection';
import HeroSectionSettings from '../components/page-builder/settings/HeroSectionSettings';
import FeatureGrid from '../components/page-builder/components/FeatureGrid';
import FeatureGridSettings from '../components/page-builder/settings/FeatureGridSettings';
import CtaBanner from '../components/page-builder/components/CtaBanner';
import CtaBannerSettings from '../components/page-builder/settings/CtaBannerSettings';
import TestimonialCard from '../components/page-builder/components/TestimonialCard';
import TestimonialSettings from '../components/page-builder/settings/TestimonialSettings';
import PricingTable from '../components/page-builder/components/PricingTable';
import PricingTableSettings from '../components/page-builder/settings/PricingTableSettings';
import FaqAccordion from '../components/page-builder/components/FaqAccordion';
import FaqAccordionSettings from '../components/page-builder/settings/FaqAccordionSettings';
import { usePageBuilderStore } from '../components/page-builder/stores/pageBuilderStore';

function slugify(text: string): string {
  return (
    '/' +
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/[\s]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  );
}

export function PageEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const schemaQuery = usePageSchema();

  const pageQuery = useQuery({
    queryKey: ['page', id],
    queryFn: () => pagesApi.getPage(id!),
    enabled: !!id && !!schemaQuery.data,
  });

  useEffect(() => {
    // Reset the global component configuration store when switching pages
    // This prevents components like 'FeatureGrid1' from bleeding across different pages
    usePageBuilderStore.getState().resetStore();
  }, [id]);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [initialBody, setInitialBody] = useState<PageBuilderDesign | undefined>(
    undefined,
  );
  const [isBuilderReady, setIsBuilderReady] = useState(false);

  const bodyRef = useRef<PageBuilderDesign>([]);

  const pageBuilderConfig = useMemo(
    () => ({
      Basic: [
        { name: 'button' },
        { name: 'header' },
        { name: 'text' },
        { name: 'image' },
        { name: 'video' },
        { name: 'container' },
        { name: 'twoCol' },
        { name: 'threeCol' },
        { name: 'table' },
        { name: 'link' },
        { name: 'richtext' },
      ],
      Extra: [],
    }),
    [],
  );

  const customComponents = useMemo(
    () => ({
      HeroSection: {
        component: HeroSection,
        settingsComponent: HeroSectionSettings,
        svg: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="2" width="14" height="12" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M4 7h8M4 10h5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
        title: 'Hero Section',
        defaultWidth: '100%',
        defaultHeight: '400px',
      },
      FeatureGrid: {
        component: FeatureGrid,
        settingsComponent: FeatureGridSettings,
        svg: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" stroke-width="1.5"/><rect x="9" y="1" width="6" height="6" rx="1" stroke="currentColor" stroke-width="1.5"/><rect x="1" y="9" width="6" height="6" rx="1" stroke="currentColor" stroke-width="1.5"/><rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" stroke-width="1.5"/></svg>',
        title: 'Feature Grid',
        defaultWidth: '100%',
        defaultHeight: '350px',
      },
      CtaBanner: {
        component: CtaBanner,
        settingsComponent: CtaBannerSettings,
        svg: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="4" width="14" height="8" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M5 8h6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
        title: 'CTA Banner',
        defaultWidth: '100%',
        defaultHeight: '200px',
      },
      TestimonialCard: {
        component: TestimonialCard,
        settingsComponent: TestimonialSettings,
        svg: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 3h10v7H9l-3 3v-3H3V3z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        title: 'Testimonial',
        defaultWidth: '400px',
        defaultHeight: '250px',
      },
      PricingTable: {
        component: PricingTable,
        settingsComponent: PricingTableSettings,
        svg: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="2" width="4" height="12" rx="1" stroke="currentColor" stroke-width="1.5"/><rect x="6" y="2" width="4" height="12" rx="1" stroke="currentColor" stroke-width="1.5"/><rect x="11" y="2" width="4" height="12" rx="1" stroke="currentColor" stroke-width="1.5"/></svg>',
        title: 'Pricing Table',
        defaultWidth: '100%',
        defaultHeight: '400px',
      },
      FaqAccordion: {
        component: FaqAccordion,
        settingsComponent: FaqAccordionSettings,
        svg: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 6h8M4 10h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5"/></svg>',
        title: 'FAQ Accordion',
        defaultWidth: '100%',
        defaultHeight: '300px',
      },
    }),
    [],
  );

  useEffect(() => {
    if (pageQuery.data) {
      setTitle(pageQuery.data.data.title);
      setSlug(pageQuery.data.data.slug);
      const bodyData = pageQuery.data.data.body;
      const safeBodyData = Array.isArray(bodyData) ? bodyData : [];
      setInitialBody(safeBodyData as PageBuilderDesign);
      bodyRef.current = safeBodyData as PageBuilderDesign;
      setIsBuilderReady(true);
    }
  }, [pageQuery.data]);

  const updateMutation = useMutation({
    mutationFn: () =>
      pagesApi.updatePage(id!, {
        title: title.trim(),
        slug: slug.trim() || slugify(title),
        body: bodyRef.current ?? [],
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages'] });
      queryClient.invalidateQueries({ queryKey: ['page', id] });
    },
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (!slugManuallyEdited) {
      setSlug(slugify(newTitle));
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlug(e.target.value);
    setSlugManuallyEdited(true);
  };

  const handleDesignChange = useCallback((newDesign: PageBuilderDesign) => {
    bodyRef.current = newDesign;
  }, []);

  useEffect(() => {
    const rebuildCustomSettingsPanel = (component: HTMLElement) => {
      const skipClasses = new Set([
        'custom-component',
        'editable-component',
        'component-resizer',
      ]);
      const componentTypeClass = Array.from(component.classList).find(
        (cls) => cls.endsWith('-component') && !skipClasses.has(cls),
      );
      if (!componentTypeClass) return;

      const componentType = componentTypeClass.replace('-component', '');
      const componentId = component.id;
      const settingsTagName = `react-settings-component-${componentType.toLowerCase()}`;

      setTimeout(() => {
        const panel = document.getElementById('functions-panel');
        if (!panel) return;

        const hasFallback = Array.from(panel.children).some(
          (el) =>
            el.tagName === 'P' &&
            el.textContent?.includes('No specific settings'),
        );
        if (!hasFallback) return;

        panel.innerHTML = '';
        let settingsEl = panel.querySelector(
          settingsTagName,
        ) as HTMLElement | null;
        if (!settingsEl) {
          settingsEl = document.createElement(settingsTagName) as HTMLElement;
          panel.appendChild(settingsEl);
        }
        settingsEl.setAttribute(
          'data-settings',
          JSON.stringify({ targetComponentId: componentId }),
        );
      }, 50);
    };

    const waitForElements = setInterval(() => {
      const canvas = document.getElementById('canvas');
      const attributeTab = document.getElementById('attribute-tab');
      if (!canvas || !attributeTab) return;
      clearInterval(waitForElements);

      // Fix A: canvas click — auto-switch to Attribute tab then rebuild panel
      canvas.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const customComp = target.closest(
          '.custom-component',
        ) as HTMLElement | null;
        if (!customComp) return;

        setTimeout(() => {
          attributeTab.click();
          rebuildCustomSettingsPanel(customComp);
        }, 0);
      });

      // Fix B: Attribute tab click — if a custom component is already selected,
      // rebuild the panel (handles switching back from Customize/Layers tabs)
      attributeTab.addEventListener('click', () => {
        const sidebar = (
          window as unknown as {
            CustomizationSidebar?: { selectedComponent: HTMLElement | null };
          }
        ).CustomizationSidebar;
        const selected: HTMLElement | null = sidebar?.selectedComponent ?? null;
        if (!selected?.classList.contains('custom-component')) return;
        rebuildCustomSettingsPanel(selected);
      });
    }, 200);

    return () => clearInterval(waitForElements);
  }, []);

  const handleSave = () => {
    if (!title.trim()) return;
    updateMutation.mutate();
  };

  if (pageQuery.isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (pageQuery.isError || !pageQuery.data) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-muted-foreground">Page not found</p>
        <button
          onClick={() => navigate('/pages')}
          className="text-primary hover:text-primary/80 font-medium"
        >
          Back to Pages
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-background">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/pages')}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex flex-col gap-1">
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="Page Title"
              className="text-lg font-semibold bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
            />
            <input
              type="text"
              value={slug}
              onChange={handleSlugChange}
              placeholder="/page-slug"
              className="text-sm font-mono bg-transparent border-none outline-none text-muted-foreground placeholder:text-muted-foreground/50"
            />
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={!title.trim() || updateMutation.isPending}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {updateMutation.isPending ? 'Saving...' : 'Save'}
        </button>
      </div>

      {/* Page Builder Canvas */}
      <div className="flex-1 overflow-hidden relative">
        <style>{`
          #functions-panel {
            overflow-y: auto !important;
            max-height: calc(100vh - 120px) !important;
            padding-bottom: 40px !important;
          }
        `}</style>
        {isBuilderReady && (
          <PageBuilderReact
            key={id}
            config={JSON.parse(JSON.stringify(pageBuilderConfig))}
            customComponents={Object.fromEntries(
              Object.entries(customComponents).map(([key, val]) => [
                key,
                { ...val },
              ]),
            )}
            initialDesign={initialBody}
            onChange={handleDesignChange}
            editable={true}
            brandTitle={title || 'Page Builder'}
            layoutMode="grid"
            showAttributeTab={true}
          />
        )}
      </div>
    </div>
  );
}
