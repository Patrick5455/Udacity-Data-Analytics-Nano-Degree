class Utils {
  constructor(Jupyter, dialog) {
    this.agreed = false;
    this.Jupyter = Jupyter;
    this.dialog = dialog;
  }

  renderModal(markdown) {
    const termsBody = '<div class="terms-and-conditions">' + markdown + '</div>';
    const termsModal = this.dialog.modal({
      title: 'To proceed, please read the following terms and conditions for the data provided in this Jupyter Notebook.',
      body: termsBody,
      sanitize:false,
      buttons: {
        'Yes, I have read these terms and conditions, and I agree with them.' : {
          click: (e) => {
            this.agreedToTerms(true);
          }
        }
      }
    });
    termsModal.find('.close').remove();
    termsModal.on('hidden.bs.modal', (e) => {
      if (!this.agreed) {
        this.renderModal(markdown);
      }
    });
  }

  agreedToTerms(status,markdown) {
    if (!status) {
      this.renderModal(markdown);
    } else {
      this.agreed = true;
      console.log('Marking terms and conditions: agreed.');
      const agreementPython = `
terms_completed_file = 'terms_and_conditions/terms_completed.md'
try:
   open(terms_completed_file, 'x')
except FileExistsError:
   pass
`;

      this.Jupyter.notebook.kernel.execute(agreementPython,
                                           undefined,
                                           {
                                             silent: false,
                                             store_history: false,
                                             stop_on_error : true
                                           });
    }
  }

  loadCss(cssPaths) {
    for (let i in cssPaths) {
      let path = cssPaths[i];
      let previousCssTag = $('#terms-css-tag-' + i);
      if (previousCssTag.length === 0) {
        // https://stackoverflow.com/questions/18510347/dynamically-load-stylesheets
        const styles = document.createElement('link');
        styles.rel = 'stylesheet';
        styles.id = 'terms-css-tag-' + i;
        styles.type = 'text/css';
        styles.media = 'screen';
        styles.href = path;
        document.getElementsByTagName('head')[0].appendChild(styles);
      }
    }
  }
}

class Terms {
  constructor(Jupyter, dialog, marked) {
    this.Jupyter = Jupyter;
    this.dialog = dialog;
    this.marked = marked;
    this.utils = new Utils(Jupyter, dialog);
  }

  check () {
    console.log('Loading terms and conditions.');

    const credentials = { credentials: 'include' };
    const termsPath = '/tree/terms_and_conditions/';
    const termsMarkdownPath = termsPath + 'terms.md';
    const termsCompletePath = termsPath + 'terms_completed.md';

    return fetch(termsMarkdownPath, credentials).then( (response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.text();
    }).then ( (termsMarkdown) => {
      fetch (termsCompletePath, credentials).then( (response) => {
        if (response.ok) {
          console.log('Already accepted terms and conditions.');
        } else {
          this.utils.loadCss(['/nbextensions/workspaces-jupyter-terms-and-conditions-dist/terms.css']); // could be racy used this way.
          this.utils.renderModal(this.marked(termsMarkdown));
        }
      })
    }).catch( (ex) => {
      console.log('Could not load terms markdown:', ex);
    });
  }
}

/* Jupyter Notebook loading hook */
define([
  'base/js/namespace',
  'base/js/dialog',
  'components/marked/lib/marked'
], (Jupyter, dialog, marked) => ({
  load_ipython_extension: () => {
    const terms = new Terms(Jupyter, dialog, marked);
    terms.check();
  }
}));

