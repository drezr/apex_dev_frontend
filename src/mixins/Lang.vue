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
          'replace': {
            'fr': 'Remplacer',
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
          'needs': {
            'fr': 'Besoins',
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
          'edit': {
            'fr': 'Modifier',
            'nl': '',
            'en': '',
          },
          'lock': {
            'fr': 'Verrouiller',
            'nl': '',
            'en': '',
          },
          'unlock': {
            'fr': 'Déverrouiller',
            'nl': '',
            'en': '',
          },
          'acquit': {
            'fr': 'Acquitter',
            'nl': '',
            'en': '',
          },
          'override': {
            'fr': 'Écraser',
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
          'empty_task': {
            'fr': 'Tâche vide',
            'nl': '',
            'en': '',
          },
          'empty_subtask': {
            'fr': 'Sous-tâche vide',
            'nl': '',
            'en': '',
          },
          'file_name': {
            'fr': 'Nom du fichier',
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
          'bnx': {
            'fr': 'BNX',
            'nl': '',
            'en': '',
          },
          'ilt': {
            'fr': 'ILT',
            'nl': '',
            'en': '',
          },
          'day': {
            'fr': 'Jour',
            'nl': '',
            'en': '',
          },
          'week': {
            'fr': 'Semaine',
            'nl': '',
            'en': '',
          },
          'schedule': {
            'fr': 'Horaire',
            'nl': '',
            'en': '',
          },
          'month': {
            'fr': 'Mois',
            'nl': '',
            'en': '',
          },
          'previous_month': {
            'fr': 'Mois précédent',
            'nl': '',
            'en': '',
          },
          'next_month': {
            'fr': 'Mois suivant',
            'nl': '',
            'en': '',
          },
          'year': {
            'fr': 'Année',
            'nl': '',
            'en': '',
          },
          'previous_year': {
            'fr': 'Année précédente',
            'nl': '',
            'en': '',
          },
          'next_year': {
            'fr': 'Année suivante',
            'nl': '',
            'en': '',
          },
          'january': {
            'fr': 'Janvier',
            'nl': '',
            'en': '',
          },
          'february': {
            'fr': 'Février',
            'nl': '',
            'en': '',
          },
          'march': {
            'fr': 'Mars',
            'nl': '',
            'en': '',
          },
          'april': {
            'fr': 'Avril',
            'nl': '',
            'en': '',
          },
          'may': {
            'fr': 'Mai',
            'nl': '',
            'en': '',
          },
          'june': {
            'fr': 'Juin',
            'nl': '',
            'en': '',
          },
          'jully': {
            'fr': 'Juillet',
            'nl': '',
            'en': '',
          },
          'august': {
            'fr': 'Août',
            'nl': '',
            'en': '',
          },
          'september': {
            'fr': 'Septembre',
            'nl': '',
            'en': '',
          },
          'october': {
            'fr': 'Octobre',
            'nl': '',
            'en': '',
          },
          'november': {
            'fr': 'Novembre',
            'nl': '',
            'en': '',
          },
          'december': {
            'fr': 'Décembre',
            'nl': '',
            'en': '',
          },
          'monday': {
            'fr': 'lundi',
            'nl': '',
            'en': '',
          },
          'tuesday': {
            'fr': 'mardi',
            'nl': '',
            'en': '',
          },
          'wednesday': {
            'fr': 'mercredi',
            'nl': '',
            'en': '',
          },
          'thursday': {
            'fr': 'jeudi',
            'nl': '',
            'en': '',
          },
          'friday': {
            'fr': 'vendredi',
            'nl': '',
            'en': '',
          },
          'saturday': {
            'fr': 'samedi',
            'nl': '',
            'en': '',
          },
          'sunday': {
            'fr': 'dimanche',
            'nl': '',
            'en': '',
          },
          'pending': {
            'fr': 'En attente',
            'nl': '',
            'en': '',
          },
          'working': {
            'fr': 'En cours',
            'nl': '',
            'en': '',
          },
          'done': {
            'fr': 'Terminé',
            'nl': '',
            'en': '',
          },
          'canceled': {
            'fr': 'Annulé',
            'nl': '',
            'en': '',
          },
          'expand': {
            'fr': 'Développer',
            'nl': '',
            'en': '',
          },
          'message': {
            'fr': 'Message',
            'nl': '',
            'en': '',
          },
          'task_no_element': {
            'fr': 'Il n\'y pas d\'élément dans cette tâche.',
            'nl': '',
            'en': '',
          },
          'log': {
            'fr': 'Historique',
            'nl': '',
            'en': '',
          },
          'text': {
            'fr': 'Texte',
            'nl': '',
            'en': '',
          },
          'add_input_tooltip': {
            'fr': 'Ajouter un champ de texte',
            'nl': '',
            'en': '',
          },
          'note': {
            'fr': 'Note',
            'nl': '',
            'en': '',
          },
          'add_note_tooltip': {
            'fr': 'Ajouter une note',
            'nl': '',
            'en': '',
          },
          'file': {
            'fr': 'Fichier',
            'nl': '',
            'en': '',
          },
          'add_file_tooltip': {
            'fr': 'Ajouter un fichier',
            'nl': '',
            'en': '',
          },
          'subtask': {
            'fr': 'Sous-tâche',
            'nl': '',
            'en': '',
          },
          'add_subtask_tooltip': {
            'fr': 'Ajouter une sous-tâche',
            'nl': '',
            'en': '',
          },
          'teams': {
            'fr': 'Équipes',
            'nl': '',
            'en': '',
          },
          'log_edited_by': {
            'fr': 'Modifié par',
            'nl': '',
            'en': '',
          },
          'log_old_value': {
            'fr': 'Ancienne valeur',
            'nl': '',
            'en': '',
          },
          'log_new_value': {
            'fr': 'Nouvelle valeur',
            'nl': '',
            'en': '',
          },
          'log_datetime': {
            'fr': 'Date de la modification',
            'nl': '',
            'en': '',
          },
          'visible': {
            'fr': 'Visible',
            'nl': '',
            'en': '',
          },
          'column_width': {
            'fr': 'Largeur de la colonne',
            'nl': '',
            'en': '',
          },
          'text_size': {
            'fr': 'Taille du texte',
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
            'fleet_desc': {
              'fr': 'Gestion des véhicules',
              'nl': '',
              'en': '',
            },
            'planner_desc': {
              'fr': 'Planificateur de journée',
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
              'fr': 'Description du dérangement',
              'nl': '',
              'en': '',
            },
            'call_kind': {
              'fr': 'Type d\'intervention',
              'nl': '',
              'en': '',
            },
            'call_description': {
              'fr': 'Description de l\'intervention',
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
            'call_link_url': {
              'fr': 'URL vers le D27',
              'nl': '',
              'en': '',
            },
            'calls_summary': {
              'fr': 'Récapitulatif des interventions',
              'nl': '',
              'en': '',
            },
            'palette_cells': {
              'fr': 'Colorer les cellules',
              'nl': '',
              'en': '',
            },
            'hour_calculator': {
              'fr': 'Convertisseur heure/décimale',
              'nl': '',
              'en': '',
            },
            'printable_calendar': {
              'fr': 'Calendrier imprimable',
              'nl': '',
              'en': '',
            },
            'leaves_management': {
              'fr': 'Gestion des congés',
              'nl': '',
              'en': '',
            },
          },
          'radium': {
            'palette_works_tooltip': {
              'fr': 'Colorer les chantier',
              'nl': '',
              'en': '',
            },
            'filter_works_tooltip': {
              'fr': 'Filtrer les chantier',
              'nl': '',
              'en': '',
            },
            'sort_works_tooltip': {
              'fr': 'Trier les chantiers par jour croissant',
              'nl': '',
              'en': '',
            },
            'printable_tooltip': {
              'fr': 'Liste imprimable des chantier du mois',
              'nl': '',
              'en': '',
            },
            'customize_tooltip': {
              'fr': 'Personnaliser Radium',
              'nl': '',
              'en': '',
            },
            'add_work_tooltip': {
              'fr': 'Ajouter un chantier',
              'nl': '',
              'en': '',
            },
            'show_messages_tooltip': {
              'fr': 'Afficher les messages',
              'nl': '',
              'en': '',
            },
            'column_title_shifts': {
              'fr': 'Prestations',
              'nl': '',
              'en': '',
            },
            'column_title_description': {
              'fr': 'Description',
              'nl': '',
              'en': '',
            },
            'column_title_note': {
              'fr': 'Remarques',
              'nl': '',
              'en': '',
            },
            'column_title_ilt': {
              'fr': 'ILT',
              'nl': '',
              'en': '',
            },
            'column_title_files': {
              'fr': 'Fichiers',
              'nl': '',
              'en': '',
            },
            'column_title_ilts': {
              'fr': 'ILT',
              'nl': '',
              'en': '',
            },
            'column_title_bnxs': {
              'fr': 'BNX',
              'nl': '',
              'en': '',
            },
            'column_title_fmhts': {
              'fr': 'FMHT',
              'nl': '',
              'en': '',
            },
            'column_title_upm': {
              'fr': 'UPM',
              'nl': '',
              'en': '',
            },
            'column_title_colt': {
              'fr': 'CoLT',
              'nl': '',
              'en': '',
            },
            'column_title_status': {
              'fr': 'Statut',
              'nl': '',
              'en': '',
            },
            'column_title_limits': {
              'fr': 'Limites de mise hors service',
              'nl': '',
              'en': '',
            },
            'column_title_s460s': {
              'fr': 'S460',
              'nl': '',
              'en': '',
            },
            'column_title_zkl': {
              'fr': 'ZKL',
              'nl': '',
              'en': '',
            },
            'column_title_cascat': {
              'fr': 'Cas caténaire',
              'nl': '',
              'en': '',
            },
            'column_title_grue': {
              'fr': 'Grue RR',
              'nl': '',
              'en': '',
            },
            'column_title_osv': {
              'fr': 'OSV',
              'nl': '',
              'en': '',
            },
            'column_title_loco': {
              'fr': 'Loco',
              'nl': '',
              'en': '',
            },
            'column_title_hgs': {
              'fr': 'HGS',
              'nl': '',
              'en': '',
            },
            'column_title_soudure': {
              'fr': 'Soudure',
              'nl': '',
              'en': '',
            },
            'column_title_pn': {
              'fr': 'PN',
              'nl': '',
              'en': '',
            },
            'column_title_art': {
              'fr': 'ART',
              'nl': '',
              'en': '',
            },
            'column_title_s428': {
              'fr': 'S428',
              'nl': '',
              'en': '',
            },
            'column_title_s461': {
              'fr': 'S461',
              'nl': '',
              'en': '',
            },
            'column_title_atwtx': {
              'fr': 'ATW-Tx',
              'nl': '',
              'en': '',
            },
            'column_title_imputation': {
              'fr': 'Imputation',
              'nl': '',
              'en': '',
            },
            'column_title_extra': {
              'fr': 'Divers',
              'nl': '',
              'en': '',
            },
            'column_title_scst': {
              'fr': 'Scst',
              'nl': '',
              'en': '',
            },
            'edit_tooltip': {
              'fr': 'Déverrouiller et modifier ce chantier',
              'nl': '',
              'en': '',
            },
            'lock_tooltip': {
              'fr': 'Verrouiller ce chantier',
              'nl': '',
              'en': '',
            },
            'delete_tooltip': {
              'fr': 'Supprimer ce chantier',
              'nl': '',
              'en': '',
            },
            'message_tooltip': {
              'fr': 'Envoyer un message concernant ce chantier',
              'nl': '',
              'en': '',
            },
            'copy_tooltip': {
              'fr': 'Créer une copie de ce chantier ici ou dans un autre mois',
              'nl': '',
              'en': '',
            },
            'move_tooltip': {
              'fr': 'Déplacer ce chantier dans un autre mois',
              'nl': '',
              'en': '',
            },
            'link_radiums_tooltip': {
              'fr': 'Lier ce chantier à d\'autres Radium',
              'nl': '',
              'en': '',
            },
            'link_teams_tooltip': {
              'fr': 'Ajouter des équipes à cette prestation',
              'nl': '',
              'en': '',
            },
            'participating_teams': {
              'fr': 'Equipes participantes au chantier',
              'nl': '',
              'en': '',
            },
            'part_needs': {
              'fr': 'Besoin de',
              'nl': '',
              'en': '',
            },
            'participating_profiles': {
              'fr': 'Agents participants',
              'nl': '',
              'en': '',
            },
            'no_participating_teams': {
              'fr': 'Aucune équipe ne participe à cette prestation.',
              'nl': '',
              'en': '',
            },
            'no_shift': {
              'fr': 'Pas encore de prestation pour ce chantier.',
              'nl': '',
              'en': '',
            },
            'remove_project': {
              'fr': 'Supprimer le lien vers le projet Draft',
              'nl': '',
              'en': '',
            },
            'remove_part': {
              'fr': 'Supprimer la participation de l\'équipe',
              'nl': '',
              'en': '',
            },
            'send_team_message': {
              'fr': 'Envoyer un message aux membres de l\'équipe',
              'nl': '',
              'en': '',
            },
            'lock_part': {
              'fr': 'Verrouiller la participation',
              'nl': '',
              'en': '',
            },
            'unlock_part': {
              'fr': 'Déverrouiller la participation',
              'nl': '',
              'en': '',
            },
            'locked_part': {
              'fr': 'Cette participation est verrouillée.',
              'nl': '',
              'en': '',
            },
            'info_override': {
              'fr': 'Écraser la troisième case des cellules',
              'nl': '',
              'en': '',
            },
            'info_override_confirm': {
              'fr': 'La troisième case des cellules des participants ont bien été écrasées.',
              'nl': '',
              'en': '',
            },
            'log_title': {
              'fr': 'Historique des modifications de la cellule',
              'nl': '',
              'en': '',
            },
            'log_no_log': {
              'fr': 'Pas de modification pour cette cellule.',
              'nl': '',
              'en': '',
            },
            'no_works': {
              'fr': 'Il n\'y a pas encore de chantier ce mois.',
              'nl': '',
              'en': '',
            },
            'message_to_linked_radiums': {
              'fr': 'Envoyer ce message aux Radium liés :',
              'nl': '',
              'en': '',
            },
            'message_presets': {
              'fr': 'Messages prédéfinis',
              'nl': '',
              'en': '',
            },
            'message_preset_work_added': {
              'fr': 'Un nouveau chantier a été ajouté.',
              'nl': '',
              'en': '',
            },
            'message_preset_date_updated': {
              'fr': 'La date du chantier a été modifiée.',
              'nl': '',
              'en': '',
            },
            'message_preset_shift_updated': {
              'fr': 'La prestation du chantier à été modifiée.',
              'nl': '',
              'en': '',
            },
            'message_preset_desc_updated': {
              'fr': 'Le travail du chantier a été modifié.',
              'nl': '',
              'en': '',
            },
            'message_preset_note_added': {
              'fr': 'Une remarque a été ajoutée.',
              'nl': '',
              'en': '',
            },
            'message_preset_bnx_added': {
              'fr': 'Un nouveau BNX a été publié.',
              'nl': '',
              'en': '',
            },
            'message_preset_ilt_added': {
              'fr': 'Une nouvelle ILT a été publiée.',
              'nl': '',
              'en': '',
            },
            'message_preset_work_canceled': {
              'fr': 'Le chantier est annulé.',
              'nl': '',
              'en': '',
            },
            'messages_dialog_title': {
              'fr': 'Messages concernant les chantiers de ce Radium',
              'nl': '',
              'en': '',
            },
            'messages_work_date': {
              'fr': 'Chantier du',
              'nl': '',
              'en': '',
            },
            'messages_no_message': {
              'fr': 'Pas de message pour le moment.',
              'nl': '',
              'en': '',
            },
            'paint_works': {
              'fr': 'Colorer les chantiers',
              'nl': '',
              'en': '',
            },
            'paint_columns': {
              'fr': 'Colorer les colonnes',
              'nl': '',
              'en': '',
            },
            'line': {
              'fr': 'Ligne',
              'nl': '',
              'en': '',
            },
            'station': {
              'fr': 'Gare',
              'nl': '',
              'en': '',
            },
            'lane': {
              'fr': 'Voie',
              'nl': '',
              'en': '',
            },
            'signal': {
              'fr': 'Signal',
              'nl': '',
              'en': '',
            },
            'pk': {
              'fr': 'PK',
              'nl': '',
              'en': '',
            },
            'from': {
              'fr': 'De',
              'nl': '',
              'en': '',
            },
            'to': {
              'fr': 'À',
              'nl': '',
              'en': '',
            },
          },
          'planner': {
            'printable_board': {
              'fr': 'Version imprimable du planning',
              'nl': '',
              'en': '',
            },
            'edit_teammates': {
              'fr': 'Modifier les agents participants',
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
