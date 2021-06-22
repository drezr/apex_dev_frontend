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
          'save': {
            'fr': 'Enregistrer',
            'nl': '',
            'en': '',
          },
          'add': {
            'fr': 'Ajouter',
            'nl': '',
            'en': '',
          },
          'delete': {
            'fr': 'Supprimer',
            'nl': '',
            'en': '',
          },
          'remove': {
            'fr': 'Retirer',
            'nl': '',
            'en': '',
          },
          'move': {
            'fr': 'Déplacer',
            'nl': '',
            'en': '',
          },
          'sort': {
            'fr': 'Trier',
            'nl': '',
            'en': '',
          },
          'update_position': {
            'fr': 'Changer l\'ordre',
            'nl': '',
            'en': '',
          },
          'cancel': {
            'fr': 'Annuler',
            'nl': '',
            'en': '',
          },
          'confirm': {
            'fr': 'Confirmer',
            'nl': '',
            'en': '',
          },
          'to_copy': {
            'fr': 'Copier',
            'nl': '',
            'en': '',
          },
          'to_link': {
            'fr': 'Lier',
            'nl': '',
            'en': '',
          },
          'connection': {
            'fr': 'Connexion',
            'nl': '',
            'en': '',
          },
          'disconnect': {
            'fr': 'Déconnexion',
            'nl': '',
            'en': '',
          },
          'change_password': {
            'fr': 'Changer de mot de passe',
            'nl': '',
            'en': '',
          },
          'name': {
            'fr': 'Nom',
            'nl': '',
            'en': '',
          },
          'ident': {
            'fr': 'Numéro d\'identification',
            'nl': '',
            'en': '',
          },
          'phone': {
            'fr': 'Numéro de téléphone',
            'nl': '',
            'en': '',
          },
          'grade': {
            'fr': 'Grade',
            'nl': '',
            'en': '',
          },
          'field': {
            'fr': 'Spécialité',
            'nl': '',
            'en': '',
          },
          'not_empty_field': {
            'fr': 'Ce champ ne peut pas être vide.',
            'nl': '',
            'en': '',
          },
          'no_result': {
            'fr': 'Aucun résultat',
            'nl': '',
            'en': '',
          },
          'shift': {
            'fr': 'Prestation',
            'nl': '',
            'en': '',
          },
          'by_author_on_date': {
            'fr': 'Par ### le @@@',
            'nl': '',
            'en': '',
          },
          'edit_options': {
            'fr': 'Options d\'édition',
            'nl': '',
            'en': '',
          },
          'empty_note': {
            'fr': 'Note vide',
            'nl': '',
            'en': '',
          },
          'start': {
            'fr': 'Début',
            'nl': '',
            'en': '',
          },
          'end': {
            'fr': 'Fin',
            'nl': '',
            'en': '',
          },
          'are_you_sure': {
            'fr': 'Êtes-vous sûr(e) ?',
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
          },
          'home': {
            'my_team': {
              'fr': 'Mon équipe',
              'nl': '',
              'en': '',
            },
            'my_teams': {
              'fr': 'Mes équipes',
              'nl': '',
              'en': '',
            },
            'circles': {
              'fr': 'Arrondissements',
              'nl': '',
              'en': '',
            },
          },
          'team': {
            'draft_desc': {
              'fr': 'Gestion de projets',
              'nl': '',
              'en': '',
            },
            'radium_desc': {
              'fr': 'Agenda de chantiers',
              'nl': '',
              'en': '',
            },
            'watcher_desc': {
              'fr': 'Calendrier d\'équipe',
              'nl': '',
              'en': '',
            },
            'access_manager_tooltip': {
              'fr': 'Gestion de l\'équipe',
              'nl': '',
              'en': '',
            },
            'access_manager_edit': {
              'fr': 'Éditer les informations de',
              'nl': '',
              'en': '',
            },
            'access_grades': {
              'fr': [
                'Agent de maintenance',
                'Agent de métier',
                'Ajusteur mécanicien',
                'Assistant technico-administratif',
                'Chargeur principal',
                'Chef de maintenance',
                'Chef technicien',
                'Commis écriture',
                'Coordinateur technique',
                '1er Chef de secteur technique',
                'Chef de secteur technique',
                'Ingénieur',
                'Manager Maintenance',
                'Opérateur track',
                'Opérateur track spécialisé',
                'Schb',
                'Sous-chef de secteur technique',
                'Secrétaire administratif',
                'Technicien',
                'Technicien principal',
              ],
              'nl': '',
              'en': '',
            },
            'access_reset_password': {
              'fr': 'Envoyer un nouveau mot de passe',
              'nl': '',
              'en': '',
            },
            'access_is_manager': {
              'fr': 'Est manager de l\'équipe',
              'nl': '',
              'en': '',
            },
            'access_is_manager_hint': {
              'fr': 'Peut ajouter des membres à l\'équipe et modifier leurs accès.',
              'nl': '',
              'en': '',
            },
            'access_draft_title': {
              'fr': 'Paramètres liés à Draft',
              'nl': '',
              'en': '',
            },
            'access_draft_is_editor': {
              'fr': 'Est éditeur',
              'nl': '',
              'en': '',
            },
            'access_draft_is_editor_hint': {
              'fr': 'Peut créer, modifier et supprimer les projets et les tâches.',
              'nl': '',
              'en': '',
            },
            'access_draft_is_user': {
              'fr': 'Est utilisateur',
              'nl': '',
              'en': '',
            },
            'access_draft_is_user_hint': {
              'fr': 'Peut changer le statut des tâches et des sous-tâches.',
              'nl': '',
              'en': '',
            },
            'access_draft_can_see_private': {
              'fr': 'Peut voir les projets privés',
              'nl': '',
              'en': '',
            },
            'access_draft_can_see_private_hint': {
              'fr': '',
              'nl': '',
              'en': '',
            },
            'access_radium_title': {
              'fr': 'Paramètres liés à Radium',
              'nl': '',
              'en': '',
            },
            'access_radium_is_editor': {
              'fr': 'Est éditeur',
              'nl': '',
              'en': '',
            },
            'access_radium_is_editor_hint': {
              'fr': 'Peut créer, modifier et supprimer les chantiers.',
              'nl': '',
              'en': '',
            },
            'access_watcher_title': {
              'fr': 'Paramètres liés à Watcher',
              'nl': '',
              'en': '',
            },
            'access_watcher_is_editor': {
              'fr': 'Est éditeur',
              'nl': '',
              'en': '',
            },
            'access_watcher_is_editor_hint': {
              'fr': 'Peut modifier les cellules, planifier le travail, modifier les éléments (tâches, fichiers, ...).',
              'nl': '',
              'en': '',
            },
            'access_watcher_is_visible': {
              'fr': 'Est visible',
              'nl': '',
              'en': '',
            },
            'access_watcher_is_visible_hint': {
              'fr': 'Apparaît dans le calendrier.',
              'nl': '',
              'en': '',
            },
            'access_watcher_is_printable': {
              'fr': 'Est imprimable',
              'nl': '',
              'en': '',
            },
            'access_watcher_is_printable_hint': {
              'fr': 'Apparaît dans le calendrier imprimable.',
              'nl': '',
              'en': '',
            },
            'access_watcher_can_see_cells': {
              'fr': 'Peut voir toutes les cellules',
              'nl': '',
              'en': '',
            },
            'access_watcher_can_see_cells_hint': {
              'fr': 'Également les cellules des autres agents.',
              'nl': '',
              'en': '',
            },
            'access_watcher_can_see_quotas': {
              'fr': 'Peut voir tous les congés',
              'nl': '',
              'en': '',
            },
            'access_watcher_can_see_quotas_hint': {
              'fr': 'Également les congés des autres agents.',
              'nl': '',
              'en': '',
            },
            'access_password_dialog_title': {
              'fr': 'Êtes-vous sûr de vouloir envoyer un nouveau mot de passe à cet utilisateur ?',
              'nl': '',
              'en': '',
            },
            'access_password_dialog_warning': {
              'fr': 'Attention, cela réinitialisera le mot de passe actuel de l\'utilisateur et il ne pourra se connecter qu\'avec le nouveau mot de passe qui lui sera envoyé par email.',
              'nl': '',
              'en': '',
            },
            'access_delete_dialog_title': {
              'fr': 'Êtes-vous sûr de vouloir retirer tous les accès de cet utilisateur ?',
              'nl': '',
              'en': '',
            },
            'access_delete_dialog_warning': {
              'fr': 'Le compte utilisateur ne sera pas supprimé d\'Apex mais uniquement ses accès à cette équipe.',
              'nl': '',
              'en': '',
            },
            'access_remove_access': {
              'fr': 'Retirer les accès',
              'nl': '',
              'en': '',
            },
            'access_create_user': {
              'fr': 'Créer un nouvel utilisateur',
              'nl': '',
              'en': '',
            },
            'access_add_existing_user': {
              'fr': 'Ajouter un utilisateur existant',
              'nl': '',
              'en': '',
            },
            'access_confirm_create_user': {
              'fr': 'Créer un nouvel utilisateur',
              'nl': '',
              'en': '',
            },
            'access_confirm_create_user_info': {
              'fr': 'Êtes-vous sûr de vouloir créer un nouvel utilisateur ?\nVous ne pourrez pas le supprimer.',
              'nl': '',
              'en': '',
            },
            'access_confirm_create_user_send_password': {
              'fr': 'Envoyer un mot de passe ?',
              'nl': '',
              'en': '',
            },
            'access_confirm_create_user_send_password_hint': {
              'fr': 'L\'utilisateur recevera un mot de passe par email et pourra se connecter à Apex.',
              'nl': '',
              'en': '',
            },
            'access_warning_user_exists': {
              'fr': 'Avant de créer un nouvel utilisateur, assurez-vous qu\'il n\'existe pas. Sinon, utilisez le champ "Ajouter un utilisateur exisitant".',
              'nl': '',
              'en': '',
            },
          },
          'watcher': {
            'calendar_detail_title': {
              'fr': 'Informations supplémentaires',
              'nl': '',
              'en': '',
            },
            'calendar_detail_subtitle_day': {
              'fr': 'Pour le @@@',
              'nl': '',
              'en': '',
            },
            'calendar_detail_subtitle_cell': {
              'fr': 'Pour ### le @@@',
              'nl': '',
              'en': '',
            },
            'calendar_detail_short': {
              'fr': 'Texte court',
              'nl': '',
              'en': '',
            },
            'calendar_detail_short_hint': {
              'fr': 'Ce texte sera affiché dans la troisième case de la cellule.',
              'nl': '',
              'en': '',
            },
            'calendar_detail_no_element': {
              'fr': 'Pas encore d\'élément dans cette journée.',
              'nl': '',
              'en': '',
            },
            'calendar_add_element_tooltip': {
              'fr': 'Ajouter un élément',
              'nl': '',
              'en': '',
            },
            'calendar_edit_elements_tooltip': {
              'fr': 'Éditer les éléments',
              'nl': '',
              'en': '',
            },
            'calendar_add_call': {
              'fr': 'Ajouter une intervention',
              'nl': '',
              'en': '',
            },
            'calendar_add_note': {
              'fr': 'Ajouter une note',
              'nl': '',
              'en': '',
            },
            'calendar_add_file': {
              'fr': 'Ajouter un fichier',
              'nl': '',
              'en': '',
            },
            'call_name': {
              'fr': 'Déscription du dérangement',
              'nl': '',
              'en': '',
            },
            'call_kind': {
              'fr': 'Type d\'intervention',
              'nl': '',
              'en': '',
            },
            'call_description': {
              'fr': 'Déscription de l\'intervention',
              'nl': '',
              'en': '',
            },
            'call_send_d27': {
              'fr': 'Envoyer un D27',
              'nl': '',
              'en': '',
            },
            'call_replace_d27': {
              'fr': 'Remplacer le D27 existant',
              'nl': '',
              'en': '',
            },
            'call_add_link_d27': {
              'fr': 'Ajouter un lien vers un D27',
              'nl': '',
              'en': '',
            },
            'call_replace_link_d27': {
              'fr': 'Remplacer le lien du D27',
              'nl': '',
              'en': '',
            },
            'call_from_to': {
              'fr': 'de @@@ à ###',
              'nl': '',
              'en': '',
            },
            'call_download_d27': {
              'fr': 'Télécharger le D27',
              'nl': '',
              'en': '',
            },
            'call_delete_existing_d27': {
              'fr': 'Supprimer le D27 existant',
              'nl': '',
              'en': '',
            },
            'call_delete_link_d27': {
              'fr': 'Supprimer le lien vers le D27',
              'nl': '',
              'en': '',
            },
          },
        },
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
