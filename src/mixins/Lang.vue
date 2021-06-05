<script>

export default {
  data() {
    return {
      lang: {
        'generic': {
          'email': {
            'fr': 'Adresse email',
            'nl': '',
            'en': '',
          },
          'password': {
            'fr': 'Mot de passe',
            'nl': '',
            'en': '',
          },
          'send': {
            'fr': 'Envoyer',
            'nl': '',
            'en': '',
          },
          'connection': {
            'fr': 'Connexion',
            'nl': '',
            'en': '',
          },
        },
        'views': {
          'login': {
            'forgot_password': {
              'fr': 'Mot de passe oublié ?',
              'nl': '',
              'en': '',
            },
            'back_to_login': {
              'fr': 'Retour à l\'écran de connexion',
              'nl': '',
              'en': '',
            },
            'error_message': {
              'fr': 'L\'adresse email ou le mot de passe est incorrect.',
              'nl': '',
              'en': '',
            },
            'reset_password_title': {
              'fr': 'Réinitialiser votre mot de passe',
              'nl': '',
              'en': '',
            },
            'reset_password_subtitle': {
              'fr': '(Vous receverez un nouveau mot de passe par email)',
              'nl': '',
              'en': '',
            },
            'error_insert_email': {
              'fr': 'Veuillez introduire une adresse email.',
              'nl': '',
              'en': '',
            },
            'error_format_email': {
              'fr': 'Le format n\'est pas valide.',
              'nl': '',
              'en': '',
            },
            'error_insert_password': {
              'fr': 'Veuillez introduire un mot de passe.',
              'nl': '',
              'en': '',
            },
          }
        }
      },
    }
  },

  computed: {
    lg() {
      return navigator.language.split('-')[0]
    }
  },
}

</script>
