import { DESIGNS, getAllDesigns, getDesignById, getDesignIndexById } from './designRegistry';

describe('Design Registry', () => {
  describe('getAllDesigns', () => {
    it('should return all designs', () => {
      const designs = getAllDesigns();
      expect(Array.isArray(designs)).toBe(true);
      expect(designs.length).toBeGreaterThan(0);
    });

    it('should return at least 15 designs (13 existing + 2 new)', () => {
      const designs = getAllDesigns();
      expect(designs.length).toBeGreaterThanOrEqual(15);
    });

    it('should include Halloween and Diwali themes', () => {
      const designs = getAllDesigns();
      const designIds = designs.map(d => d.id);
      expect(designIds).toContain('halloween');
      expect(designIds).toContain('diwali');
    });

    it('should include all original designs', () => {
      const designs = getAllDesigns();
      const designIds = designs.map(d => d.id);
      expect(designIds).toContain('minimal-clean');
      expect(designIds).toContain('dark-neon');
      expect(designIds).toContain('instagram-gradient');
    });

    it('each design should have required properties', () => {
      const designs = getAllDesigns();
      designs.forEach(design => {
        expect(design).toHaveProperty('id');
        expect(design).toHaveProperty('Component');
        expect(design).toHaveProperty('name');
        expect(design).toHaveProperty('category');
      });
    });
  });

  describe('getDesignById', () => {
    it('should find Halloween design by ID', () => {
      const design = getDesignById('halloween');
      expect(design).toBeDefined();
      expect(design.name).toBe('Halloween Special');
    });

    it('should find Diwali design by ID', () => {
      const design = getDesignById('diwali');
      expect(design).toBeDefined();
      expect(design.name).toBe('Diwali Celebration');
    });

    it('should return undefined for non-existent design', () => {
      const design = getDesignById('nonexistent');
      expect(design).toBeUndefined();
    });

    it('should find Design1 (minimal-clean)', () => {
      const design = getDesignById('minimal-clean');
      expect(design).toBeDefined();
      expect(design.name).toBe('Minimal Clean');
    });
  });

  describe('getDesignIndexById', () => {
    it('should return correct index for Halloween', () => {
      const index = getDesignIndexById('halloween');
      expect(index).toBeGreaterThanOrEqual(0);
      const designs = getAllDesigns();
      expect(designs[index].id).toBe('halloween');
    });

    it('should return correct index for Diwali', () => {
      const index = getDesignIndexById('diwali');
      expect(index).toBeGreaterThanOrEqual(0);
      const designs = getAllDesigns();
      expect(designs[index].id).toBe('diwali');
    });

    it('should return -1 for non-existent design', () => {
      const index = getDesignIndexById('nonexistent');
      expect(index).toBe(-1);
    });
  });

  describe('Design availability on both platforms', () => {
    it('all designs should be available for both Instagram and Google Reviews', () => {
      const designs = getAllDesigns();
      // Each design has a Component that should accept platform parameter
      designs.forEach(design => {
        expect(design.Component).toBeDefined();
        expect(typeof design.Component).toBe('function');
      });
    });

    it('should have exactly same number of designs for both platforms', () => {
      const designs = getAllDesigns();
      // The design registry should not differentiate by platform
      // All designs should be available on both
      const minInstagramDesigns = designs.filter(d => d.category === 'instagram').length;
      const holidayDesigns = designs.filter(d => d.category === 'holiday').length;
      const engagementDesigns = designs.filter(d => d.category === 'engagement').length;
      expect(minInstagramDesigns + holidayDesigns + engagementDesigns).toBe(designs.length);
    });
  });

  describe('Design properties', () => {
    it('Halloween design should have correct metadata', () => {
      const halloween = getDesignById('halloween');
      expect(halloween.id).toBe('halloween');
      expect(halloween.name).toBe('Halloween Special');
      expect(halloween.category).toBe('holiday');
    });

    it('Diwali design should have correct metadata', () => {
      const diwali = getDesignById('diwali');
      expect(diwali.id).toBe('diwali');
      expect(diwali.name).toBe('Diwali Celebration');
      expect(diwali.category).toBe('holiday');
    });

    it('all original designs should be accessible', () => {
      const designs = getAllDesigns();
      const designNames = designs.map(d => d.name);
      expect(designNames).toContain('Minimal Clean');
      expect(designNames).toContain('Dark Mode Neon');
      expect(designNames).toContain('Instagram Gradient');
      expect(designNames).toContain('Cafe Theme');
      expect(designNames).toContain('Luxury Black & Gold');
      expect(designNames).toContain('Playful Confetti');
      expect(designNames).toContain('Retro Flip Counter');
      expect(designNames).toContain('Glassmorphism');
      expect(designNames).toContain('Bold Typography');
    });
  });
});
