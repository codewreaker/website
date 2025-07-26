export const scrollToSection =
  (sectionId: string, cb?: ((id: string) => void) | null, offset?: number) =>
  (e:any) => {
    const target = document.getElementById(sectionId);
    if (target) {
      e.preventDefault();
      // Update URL without jumping
      window.history.pushState(null, '', `#${sectionId}`);
      if (offset) {
        const targetPosition = target.offsetTop;
        console.log('targetPosition', targetPosition);
        window.scrollTo({
          behavior: 'smooth',
          top: targetPosition - offset,
        });
      } else {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }

    if (cb && typeof cb === 'function') {
      cb(sectionId);
    }
  };
