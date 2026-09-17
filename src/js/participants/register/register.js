/* Connect form activity to the registration wizard's active/completed states. */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.card-form form');
  const steps = [...document.querySelectorAll('#wizard-steps [data-step]')];
  const fieldsets = [...document.querySelectorAll('.card-form .wizard-step')];
  const indigenousGroup = document.querySelector('#indegenous_group');
  const tribeName = document.querySelector('#tribe_name');
  const dietaryRestriction = document.querySelector('#dietary_restriction');
  const allergiesOn = document.querySelector('#allergies_on');
  const region = document.querySelector('#region_id');
  const district = document.querySelector('#district_number');
  const province = document.querySelector('#province_id');
  const municipality = document.querySelector('#municipality_id');
  const barangay = document.querySelector('#barangay_id');
  const associationStatus = [...document.querySelectorAll('input[name="association_status"]')];
  const associationName = document.querySelector('#associate_name');
  const associationRole = document.querySelector('#associate_role');
  const submitButton = form?.querySelector('button[type="submit"]');

  if (!form || !steps.length || !fieldsets.length) return;

  let currentStep = Number(
    document.querySelector('#wizard-steps .is-current, #wizard-steps .active')?.dataset.step ?? 0
  );

  const isRequiredControlValid = (control) => {
    if (control.disabled) return true;

    if (control.matches('input[type="checkbox"]')) {
      return control.checked && control.validity.valid;
    }

    if (control.matches('input[type="radio"]')) {
      const group = [...form.querySelectorAll('input[type="radio"]')].filter(
        (radio) => radio.name === control.name
      );
      return group.some((radio) => radio.checked) && control.validity.valid;
    }

    return control.value.trim().length > 0 && control.validity.valid;
  };

  const isStepComplete = (fieldset) =>
    [...fieldset.querySelectorAll('input[required], select[required], textarea[required]')]
      .every(isRequiredControlValid);

  const getFirstIncompleteStep = () => {
    const finalStep = Number(fieldsets.at(-1).dataset.step);

    for (const fieldset of fieldsets) {
      if (!isStepComplete(fieldset)) {
        return Number(fieldset.dataset.step);
      }
    }

    return finalStep + 1;
  };

  const updateWizard = () => {
    const firstIncompleteStep = getFirstIncompleteStep();
    const progressStep = Math.min(currentStep, firstIncompleteStep);

    steps.forEach((step) => {
      const stepNumber = Number(step.dataset.step);
      // A green check is only shown for steps that are both valid and behind
      // the capped progress position. The progress marker identifies the gap.
      const isCompleted = stepNumber < progressStep;
      const isProgressStep = stepNumber === progressStep;
      const isCurrent = stepNumber === currentStep;

      step.classList.toggle('is-completed', isCompleted);
      step.classList.toggle('is-progress', isProgressStep);
      step.classList.toggle('is-current', isCurrent);
      step.classList.remove('active');
      step.setAttribute('aria-current', isCurrent ? 'step' : 'false');
    });
  };

  const syncCurrentStep = (event) => {
    const fieldset = event.target.closest('.wizard-step');
    if (!fieldset || !form.contains(fieldset)) return;

    currentStep = Number(fieldset.dataset.step);
  };

  const recalculateWizardProgress = (event) => {
    if (event) syncCurrentStep(event);
    updateWizard();
  };

  form.addEventListener('input', recalculateWizardProgress);
  form.addEventListener('change', recalculateWizardProgress);
  form.addEventListener('blur', recalculateWizardProgress, true);
  form.addEventListener('focusin', recalculateWizardProgress);
  form.addEventListener('click', recalculateWizardProgress);
  form.addEventListener('keydown', (event) => {
    if (event.key === 'Tab') {
      // Browser autocomplete can apply a value as focus moves without firing
      // input/change, so validate after the Tab navigation has completed.
      setTimeout(recalculateWizardProgress);
    }
  });

  // Programmatic assignments (for example, control.value = '...') do not
  // emit input/change events. Observe them so the wizard never goes stale.
  let progressRecalculationQueued = false;
  const scheduleProgressRecalculation = () => {
    if (progressRecalculationQueued) return;

    progressRecalculationQueued = true;
    queueMicrotask(() => {
      progressRecalculationQueued = false;
      updateWizard();
    });
  };

  const observeProgrammaticValueChanges = (control) => {
    const prototype = control instanceof HTMLSelectElement
      ? HTMLSelectElement.prototype
      : control instanceof HTMLTextAreaElement
        ? HTMLTextAreaElement.prototype
        : HTMLInputElement.prototype;
    const properties = control instanceof HTMLSelectElement
      ? ['value', 'selectedIndex']
      : control instanceof HTMLInputElement
        ? ['value', 'checked']
        : ['value'];

    properties.forEach((property) => {
      const descriptor = Object.getOwnPropertyDescriptor(prototype, property);
      if (!descriptor?.get || !descriptor.set) return;

      Object.defineProperty(control, property, {
        configurable: true,
        get: () => descriptor.get.call(control),
        set: (value) => {
          descriptor.set.call(control, value);
          scheduleProgressRecalculation();
        },
      });
    });
  };

  form.querySelectorAll('input, select, textarea').forEach(observeProgrammaticValueChanges);
  new MutationObserver(scheduleProgressRecalculation).observe(form, {
    attributes: true,
    childList: true,
    subtree: true,
    attributeFilter: ['checked', 'disabled', 'required', 'selected', 'value'],
  });
  form.addEventListener('reset', () => setTimeout(scheduleProgressRecalculation));
  window.addEventListener('pageshow', scheduleProgressRecalculation);

  const setSubmitLoading = (isLoading) => {
    if (!submitButton) return;

    submitButton.disabled = isLoading;
    submitButton.classList.toggle('is-loading', isLoading);
    submitButton.setAttribute('aria-busy', String(isLoading));
  };

  // The submit event only fires after built-in required/pattern validation.
  form.addEventListener('submit', () => setSubmitLoading(true));
  window.addEventListener('pageshow', () => setSubmitLoading(false));

  // Retain compatibility with existing navigation that marks an indicator as
  // active instead of dispatching an input event.
  new MutationObserver((mutations) => {
    const navigationStep = mutations
      .map((mutation) => mutation.target)
      .find((step) => step.classList.contains('active') || step.classList.contains('is-current'));
    if (!navigationStep) return;

    const nextCurrentStep = Number(navigationStep.dataset.step);
    if (nextCurrentStep === currentStep) return;

    currentStep = nextCurrentStep;
    updateWizard();
  }).observe(document.querySelector('#wizard-steps'), {
    attributes: true,
    attributeFilter: ['class'],
    childList: false,
    subtree: true,
  });

  const syncTribeName = () => {
    if (!tribeName) return;

    const canEnterTribeName = indigenousGroup?.value === 'Yes';

    tribeName.disabled = !canEnterTribeName;

    if (!canEnterTribeName) {
      tribeName.value = '';
    }
  };

  indigenousGroup?.addEventListener('change', syncTribeName);
  syncTribeName();

  const syncAllergies = () => {
    if (!allergiesOn) return;

    const canEnterAllergies = dietaryRestriction?.value === 'Allergies';

    allergiesOn.disabled = !canEnterAllergies;

    if (!canEnterAllergies) {
      allergiesOn.value = '';
    }
  };

  dietaryRestriction?.addEventListener('change', syncAllergies);
  syncAllergies();

  const syncAssociationFields = () => {
    const belongsToAssociation = associationStatus.some(
      (radio) => radio.checked && radio.value === 'Yes'
    );

    [associationName, associationRole].forEach((field) => {
      if (!field) return;

      field.disabled = !belongsToAssociation;
      field.required = belongsToAssociation;

      if (!belongsToAssociation) {
        field.value = '';
      }
    });
  };

  associationStatus.forEach((radio) => {
    radio.addEventListener('change', syncAssociationFields);
  });
  syncAssociationFields();

  // Development-only hierarchy. Replace this object with the corresponding
  // database/API records while preserving each record's parent ID.
  const addressHierarchy = {
    region_4a: {
      districts: {
        quezon_1st: {
          label: 'Quezon 1st District',
          provinces: {
            quezon: {
              label: 'Quezon',
              municipalities: {
                jomalig: {
                  label: 'Jomalig',
                  barangays: { bukal: 'Bukal', talisoy: 'Talisoy' },
                },
              },
            },
          },
        },
        laguna_1st: {
          label: 'Laguna 1st District',
          provinces: {
            laguna: {
              label: 'Laguna',
              municipalities: {
                pakil: {
                  label: 'Pakil',
                  barangays: { banilan: 'Banilan', casa_real: 'Casa Real' },
                },
              },
            },
          },
        },
      },
    },
    region_1: {
      districts: {
        pangasinan_1st: {
          label: 'Pangasinan 1st District',
          provinces: {
            pangasinan: {
              label: 'Pangasinan',
              municipalities: {
                alaminos: {
                  label: 'Alaminos',
                  barangays: { alos: 'Alos', baleyadaan: 'Baleyadaan' },
                },
              },
            },
          },
        },
      },
    },
  };

  const resetAddressSelect = (select, placeholder) => {
    if (!select) return;

    select.replaceChildren(new Option(placeholder, '', true, true));
    select.disabled = true;
  };

  const populateAddressSelect = (select, records, placeholder) => {
    resetAddressSelect(select, placeholder);

    Object.entries(records).forEach(([id, record]) => {
      select.add(new Option(typeof record === 'string' ? record : record.label, id));
    });

    select.disabled = false;
  };

  const syncAddressHierarchy = () => {
    const selectedRegion = addressHierarchy[region?.value];
    resetAddressSelect(district, 'Choose a region first');
    resetAddressSelect(province, 'Choose a district first');
    resetAddressSelect(municipality, 'Choose a province first');
    resetAddressSelect(barangay, 'Choose a municipality first');

    if (!selectedRegion) return;
    populateAddressSelect(district, selectedRegion.districts, 'Choose..');
  };

  const syncDistrict = () => {
    const selectedDistrict = addressHierarchy[region?.value]?.districts[district?.value];
    resetAddressSelect(province, 'Choose a district first');
    resetAddressSelect(municipality, 'Choose a province first');
    resetAddressSelect(barangay, 'Choose a municipality first');

    if (!selectedDistrict) return;
    populateAddressSelect(province, selectedDistrict.provinces, 'Choose..');
  };

  const syncProvince = () => {
    const selectedProvince = addressHierarchy[region?.value]?.districts[district?.value]?.provinces[province?.value];
    resetAddressSelect(municipality, 'Choose a province first');
    resetAddressSelect(barangay, 'Choose a municipality first');

    if (!selectedProvince) return;
    populateAddressSelect(municipality, selectedProvince.municipalities, 'Choose..');
  };

  const syncMunicipality = () => {
    const selectedMunicipality = addressHierarchy[region?.value]?.districts[district?.value]?.provinces[province?.value]?.municipalities[municipality?.value];
    resetAddressSelect(barangay, 'Choose a municipality first');

    if (!selectedMunicipality) return;
    populateAddressSelect(barangay, selectedMunicipality.barangays, 'Choose..');
  };

  region?.addEventListener('change', syncAddressHierarchy);
  district?.addEventListener('change', syncDistrict);
  province?.addEventListener('change', syncProvince);
  municipality?.addEventListener('change', syncMunicipality);
  syncAddressHierarchy();
  updateWizard();
});
