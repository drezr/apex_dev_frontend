<script>

export default {
  data() {
    return {
      lang: {
        'generic': {
          'email': {
            'fr': 'Adresse email',
            'nl': '',
            'en': 'Email address',
          },
          'password': {
            'fr': 'Mot de passe',
            'nl': '',
            'en': 'Password',
          },
          'send': {
            'fr': 'Envoyer',
            'nl': '',
            'en': 'Send',
          },
          'save': {
            'fr': 'Enregistrer',
            'nl': '',
            'en': 'Save',
          },
          'apply': {
            'fr': 'Appliquer',
            'nl': '',
            'en': 'Apply',
          },
          'add': {
            'fr': 'Ajouter',
            'nl': '',
            'en': 'Add',
          },
          'delete': {
            'fr': 'Supprimer',
            'nl': '',
            'en': 'Delete',
          },
          'remove': {
            'fr': 'Retirer',
            'nl': '',
            'en': 'Remove',
          },
          'move': {
            'fr': 'Déplacer',
            'nl': '',
            'en': 'Move',
          },
          'replace': {
            'fr': 'Remplacer',
            'nl': '',
            'en': 'Replace',
          },
          'restore': {
            'fr': 'Restaurer',
            'nl': '',
            'en': 'Restore',
          },
          'sort': {
            'fr': 'Trier',
            'nl': '',
            'en': 'Sort',
          },
          'filter': {
            'fr': 'Filtrer',
            'nl': '',
            'en': 'Filter',
          },
          'update_position': {
            'fr': 'Changer l\'ordre',
            'nl': '',
            'en': 'Change order',
          },
          'needs': {
            'fr': 'Besoins',
            'nl': '',
            'en': 'Needs',
          },
          'cancel': {
            'fr': 'Annuler',
            'nl': '',
            'en': 'Cancel',
          },
          'confirm': {
            'fr': 'Confirmer',
            'nl': '',
            'en': 'Confirm',
          },
          'edit': {
            'fr': 'Modifier',
            'nl': '',
            'en': 'Edit',
          },
          'lock': {
            'fr': 'Verrouiller',
            'nl': '',
            'en': 'Lock',
          },
          'unlock': {
            'fr': 'Déverrouiller',
            'nl': '',
            'en': 'Unlock',
          },
          'acquit': {
            'fr': 'Acquitter',
            'nl': '',
            'en': 'Acquit',
          },
          'create': {
            'fr': 'Créer',
            'nl': '',
            'en': 'Create',
          },
          'go': {
            'fr': 'Aller',
            'nl': '',
            'en': 'Go',
          },
          'visit': {
            'fr': 'Visiter',
            'nl': '',
            'en': 'Visit',
          },
          'override': {
            'fr': 'Écraser',
            'nl': '',
            'en': 'Override',
          },
          'to_copy': {
            'fr': 'Copier',
            'nl': '',
            'en': 'Copy',
          },
          'to_link': {
            'fr': 'Lier',
            'nl': '',
            'en': 'Link',
          },
          'connection': {
            'fr': 'Connexion',
            'nl': '',
            'en': 'Connection',
          },
          'disconnect': {
            'fr': 'Déconnexion',
            'nl': '',
            'en': 'Disconnect',
          },
          'change_password': {
            'fr': 'Changer de mot de passe',
            'nl': '',
            'en': 'Change password',
          },
          'name': {
            'fr': 'Nom',
            'nl': '',
            'en': 'Nome',
          },
          'ident': {
            'fr': 'Numéro d\'identification',
            'nl': '',
            'en': 'Identification number',
          },
          'phone': {
            'fr': 'Numéro de téléphone',
            'nl': '',
            'en': 'Phone number',
          },
          'grade': {
            'fr': 'Grade',
            'nl': '',
            'en': 'Grade',
          },
          'field': {
            'fr': 'Spécialité',
            'nl': '',
            'en': 'Field',
          },
          'url': {
            'fr': 'URL',
            'nl': '',
            'en': 'URL',
          },
          'coordinates': {
            'fr': 'Coordonées',
            'nl': '',
            'en': 'Coordinates',
          },
          'not_empty_field': {
            'fr': 'Ce champ ne peut pas être vide.',
            'nl': '',
            'en': 'This field cannot be empty',
          },
          'no_result': {
            'fr': 'Aucun résultat',
            'nl': '',
            'en': 'No result',
          },
          'shift': {
            'fr': 'Prestation',
            'nl': '',
            'en': 'Shift',
          },
          'by_author_on_date': {
            'fr': 'Par ### le @@@',
            'nl': '',
            'en': 'By ### the @@@',
          },
          'edit_options': {
            'fr': 'Options d\'édition',
            'nl': '',
            'en': 'Editing options',
          },
          'empty_note': {
            'fr': 'Note vide',
            'nl': '',
            'en': 'Empty note',
          },
          'empty_task': {
            'fr': 'Tâche vide',
            'nl': '',
            'en': 'Empty task',
          },
          'empty_subtask': {
            'fr': 'Sous-tâche vide',
            'nl': '',
            'en': 'Empty subtask',
          },
          'file_name': {
            'fr': 'Nom du fichier',
            'nl': '',
            'en': 'File name',
          },
          'team': {
            'fr': 'Équipe',
            'nl': '',
            'en': 'Team',
          },
          'start': {
            'fr': 'Début',
            'nl': '',
            'en': 'Start',
          },
          'end': {
            'fr': 'Fin',
            'nl': '',
            'en': 'End',
          },
          'are_you_sure': {
            'fr': 'Êtes-vous sûr(e) ?',
            'nl': '',
            'en': 'Are you sure ?',
          },
          'bnx': {
            'fr': 'BNX',
            'nl': '',
            'en': '???',
          },
          'ilt': {
            'fr': 'ILT',
            'nl': '',
            'en': '???',
          },
          'hour': {
            'fr': 'Heure',
            'nl': '',
            'en': 'Hour',
          },
          'day': {
            'fr': 'Jour',
            'nl': '',
            'en': 'Day',
          },
          'day_alt': {
            'fr': 'Journée',
            'nl': '',
            'en': 'Day',
          },
          'previous_day': {
            'fr': 'Jour précédent',
            'nl': '',
            'en': 'Previous day',
          },
          'next_day': {
            'fr': 'Jour suivant',
            'nl': '',
            'en': 'Next day',
          },
          'week': {
            'fr': 'Semaine',
            'nl': '',
            'en': 'Week',
          },
          'schedule': {
            'fr': 'Horaire',
            'nl': '',
            'en': 'Schedule',
          },
          'month': {
            'fr': 'Mois',
            'nl': '',
            'en': 'Month',
          },
          'previous_month': {
            'fr': 'Mois précédent',
            'nl': '',
            'en': 'Previous month',
          },
          'next_month': {
            'fr': 'Mois suivant',
            'nl': '',
            'en': 'Next month',
          },
          'year': {
            'fr': 'Année',
            'nl': '',
            'en': 'Year',
          },
          'previous_year': {
            'fr': 'Année précédente',
            'nl': '',
            'en': 'Previous year',
          },
          'next_year': {
            'fr': 'Année suivante',
            'nl': '',
            'en': 'Next year',
          },
          'date': {
            'fr': 'Date',
            'nl': '',
            'en': 'Date',
          },
          'january': {
            'fr': 'Janvier',
            'nl': '',
            'en': 'January',
          },
          'february': {
            'fr': 'Février',
            'nl': '',
            'en': 'February',
          },
          'march': {
            'fr': 'Mars',
            'nl': '',
            'en': 'March',
          },
          'april': {
            'fr': 'Avril',
            'nl': '',
            'en': 'April',
          },
          'may': {
            'fr': 'Mai',
            'nl': '',
            'en': 'May',
          },
          'june': {
            'fr': 'Juin',
            'nl': '',
            'en': 'June',
          },
          'july': {
            'fr': 'Juillet',
            'nl': '',
            'en': 'July',
          },
          'august': {
            'fr': 'Août',
            'nl': '',
            'en': 'August',
          },
          'september': {
            'fr': 'Septembre',
            'nl': '',
            'en': 'September',
          },
          'october': {
            'fr': 'Octobre',
            'nl': '',
            'en': 'October',
          },
          'november': {
            'fr': 'Novembre',
            'nl': '',
            'en': 'November',
          },
          'december': {
            'fr': 'Décembre',
            'nl': '',
            'en': 'December',
          },
          'monday': {
            'fr': 'lundi',
            'nl': '',
            'en': 'Monday',
          },
          'tuesday': {
            'fr': 'mardi',
            'nl': '',
            'en': 'Tuesday',
          },
          'wednesday': {
            'fr': 'mercredi',
            'nl': '',
            'en': 'Wednesday',
          },
          'thursday': {
            'fr': 'jeudi',
            'nl': '',
            'en': 'Thursday',
          },
          'friday': {
            'fr': 'vendredi',
            'nl': '',
            'en': 'Friday',
          },
          'saturday': {
            'fr': 'Samedi',
            'nl': '',
            'en': 'saturday',
          },
          'sunday': {
            'fr': 'Dimanche',
            'nl': '',
            'en': 'Sunday',
          },
          'holiday': {
            'fr': 'Férié',
            'nl': '',
            'en': 'Holiday',
          },
          'counter': {
            'fr': 'Compteur',
            'nl': '',
            'en': 'Counter',
          },
          'counter_sick': {
            'fr': 'Maladie',
            'nl': '',
            'en': 'Sick',
          },
          'counter_special': {
            'fr': 'Circonstance',
            'nl': '',
            'en': 'Counter',
          },
          'counter_unjustified': {
            'fr': 'Injustifié',
            'nl': '',
            'en': 'Counter',
          },
          'counter_strike': {
            'fr': 'Grève',
            'nl': '',
            'en': 'Strike',
          },
          'counter_wounded': {
            'fr': 'Blessé',
            'nl': '',
            'en': 'Wounded',
          },
          'ignore': {
            'fr': 'Ignoré',
            'nl': '',
            'en': 'Ignored',
          },
          'pending': {
            'fr': 'En attente',
            'nl': '',
            'en': 'Pending',
          },
          'normal_leave': {
            'fr': 'Congés normaux',
            'nl': '',
            'en': 'Leaves',
          },
          'credit_day': {
            'fr': 'Jours de crédit',
            'nl': '',
            'en': 'Credit days',
          },
          'variable_leave': {
            'fr': 'Congés variables',
            'nl': '',
            'en': 'Variable leave days',
          },
          'working': {
            'fr': 'En cours',
            'nl': '',
            'en': 'Working',
          },
          'done': {
            'fr': 'Terminé',
            'nl': '',
            'en': 'Done',
          },
          'canceled': {
            'fr': 'Annulé',
            'nl': '',
            'en': 'Canceled',
          },
          'print': {
            'fr': 'Imprimer',
            'nl': '',
            'en': 'Print',
          },
          'expand': {
            'fr': 'Développer',
            'nl': '',
            'en': 'Expand',
          },
          'presence': {
            'fr': 'Présence',
            'nl': '',
            'en': 'Presence',
          },
          'presences': {
            'fr': 'Présences',
            'nl': '',
            'en': 'Presences',
          },
          'absence': {
            'fr': 'Absence',
            'nl': '',
            'en': 'Absence',
          },
          'absences': {
            'fr': 'Absences',
            'nl': '',
            'en': 'Absences',
          },
          'recovery': {
            'fr': 'Récupération',
            'nl': '',
            'en': 'Recovery',
          },
          'message': {
            'fr': 'Message',
            'nl': '',
            'en': 'Message',
          },
          'task_no_element': {
            'fr': 'Il n\'y pas d\'élément dans cette tâche.',
            'nl': '',
            'en': 'There is no element in this task.',
          },
          'log': {
            'fr': 'Historique',
            'nl': '',
            'en': 'History',
          },
          'text': {
            'fr': 'Texte',
            'nl': '',
            'en': 'Text',
          },
          'add_input_tooltip': {
            'fr': 'Ajouter un champ de texte',
            'nl': '',
            'en': 'Add input field',
          },
          'loading': {
            'fr': 'Chargement',
            'nl': '',
            'en': 'Loading',
          },
          'task': {
            'fr': 'Tâche',
            'nl': '',
            'en': 'Task',
          },
          'tasks': {
            'fr': 'Tâches',
            'nl': '',
            'en': 'Tasks',
          },
          'note': {
            'fr': 'Note',
            'nl': '',
            'en': 'Note',
          },
          'add_note_tooltip': {
            'fr': 'Ajouter une note',
            'nl': '',
            'en': 'Add note',
          },
          'file': {
            'fr': 'Fichier',
            'nl': '',
            'en': 'File',
          },
          'add_file_tooltip': {
            'fr': 'Ajouter un fichier',
            'nl': '',
            'en': 'Add file',
          },
          'subtask': {
            'fr': 'Sous-tâche',
            'nl': '',
            'en': 'Subtask',
          },
          'add_subtask_tooltip': {
            'fr': 'Ajouter une sous-tâche',
            'nl': '',
            'en': 'Add subtask',
          },
          'teams': {
            'fr': 'Équipes',
            'nl': '',
            'en': 'Teams',
          },
          'log_edited_by': {
            'fr': 'Modifié par',
            'nl': '',
            'en': 'Edited by',
          },
          'log_old_value': {
            'fr': 'Ancienne valeur',
            'nl': '',
            'en': 'Old value',
          },
          'log_new_value': {
            'fr': 'Nouvelle valeur',
            'nl': '',
            'en': 'New value',
          },
          'log_datetime': {
            'fr': 'Date de la modification',
            'nl': '',
            'en': 'Edit date',
          },
          'visible': {
            'fr': 'Visible',
            'nl': '',
            'en': 'Visible',
          },
          'column_width': {
            'fr': 'Largeur de la colonne',
            'nl': '',
            'en': 'Column width',
          },
          'text_size': {
            'fr': 'Taille du texte',
            'nl': '',
            'en': 'Text size',
          },
          'calendar': {
            'fr': 'Calendrier',
            'nl': '',
            'en': 'Calendar',
          },
          'input_short': {
            'fr': 'Texte court',
            'nl': '',
            'en': 'Short text',
          },
          'input_long': {
            'fr': 'Texte long',
            'nl': '',
            'en': 'Long text',
          },
          'input_title': {
            'fr': 'Titre',
            'nl': '',
            'en': 'Title',
          },
          'input_date': {
            'fr': 'Date',
            'nl': '',
            'en': 'Date',
          },
          'input_gps': {
            'fr': 'Position GPS',
            'nl': '',
            'en': 'GPS position',
          },
          'input_link': {
            'fr': 'Lien',
            'nl': '',
            'en': 'Link',
          },
          'input_value': {
            'fr': 'Valeur',
            'nl': '',
            'en': 'Value',
          },
          'models': {
            'fr': 'Modèles',
            'nl': '',
            'en': 'Models',
          },
          'printable_version': {
            'fr': 'Version imprimable',
            'nl': '',
            'en': 'Printable version',
          },
          'all': {
            'fr': 'Tout',
            'nl': '',
            'en': 'Every',
          },
          'all_alt': {
            'fr': 'Toutes',
            'nl': '',
            'en': 'Every',
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
            'error_email_exist': {
              'fr': 'Un profil utilise déjà cette adresse email.',
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
              'en': 'My team',
            },
            'my_teams': {
              'fr': 'Mes équipes',
              'nl': '',
              'en': 'My teams',
            },
            'circles': {
              'fr': 'Cercles',
              'nl': '',
              'en': 'Circles',
            },
            'my_circle': {
              'fr': 'Mon cercle',
              'nl': '',
              'en': 'My circle',
            },
            'my_circles': {
              'fr': 'Mes cercles',
              'nl': '',
              'en': 'My circles',
            },
            'change_password': {
              'fr': 'Changement de mot de passe',
              'nl': '',
              'en': 'Change password',
            },
            'current_password': {
              'fr': 'Mot de passe actuel',
              'nl': '',
              'en': 'Current password',
            },
            'new_password': {
              'fr': 'Nouveau mot de passe',
              'nl': '',
              'en': 'New password',
            },
            'new_password_confirm': {
              'fr': 'Confirmez le mot de passe',
              'nl': '',
              'en': 'Confirm new password',
            },
            'min_8_character': {
              'fr': 'Minimum 8 caractères',
              'nl': '',
              'en': '8 characters minimum',
            },
            'password_change_success': {
              'fr': 'Votre mot de passe a bien été changé.',
              'nl': '',
              'en': 'Your password has been successfully updated.',
            },
            'error_password_length': {
              'fr': 'Votre mot de passe est trop court (minimum 8 caractères).',
              'nl': '',
              'en': '',
            },
            'error_password_not_same': {
              'fr': 'La confirmation de votre mot de passe est différente.',
              'nl': '',
              'en': '',
            },
            'error_password_wrong': {
              'fr': 'Une erreur s\'est produite lors du changement de votre mot de passe.',
              'nl': '',
              'en': '',
            },
            'select_language': {
              'fr': 'Sélectionner votre langue',
              'nl': 'Selecteer je taal',
              'en': 'Select your language',
            },
            'language_french': {
              'fr': 'Français',
              'nl': '',
              'en': 'French',
            },
            'language_english': {
              'fr': 'Anglais',
              'nl': '',
              'en': 'English',
            },
            'language_dutch': {
              'fr': 'Néérlandais',
              'nl': '',
              'en': 'Dutch',
            },
          },
          'team': {
            'draft_desc': {
              'fr': 'Gestion de projets',
              'nl': '',
              'en': 'Project management',
            },
            'fleet_desc': {
              'fr': 'Gestion des véhicules',
              'nl': '',
              'en': 'Vehicles management',
            },
            'planner_desc': {
              'fr': 'Planificateur de travail',
              'nl': '',
              'en': 'Work planner',
            },
            'radium_desc': {
              'fr': 'Agenda de chantiers',
              'nl': '',
              'en': 'Work agenda',
            },
            'watcher_desc': {
              'fr': 'Calendrier d\'équipe',
              'nl': '',
              'en': 'Team calendar',
            },
            'nexus_desc': {
              'fr': 'Personnes disponibles',
              'nl': '',
              'en': 'Available people',
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
            'access_planner_title': {
              'fr': 'Paramètres liés à Planner',
              'nl': '',
              'en': '',
            },
            'access_planner_is_editor': {
              'fr': 'Est éditeur',
              'nl': '',
              'en': '',
            },
            'access_planner_is_editor_hint': {
              'fr': 'Peut créer, planifier, modifier et supprimer les tâches.',
              'nl': '',
              'en': '',
            },
            'access_planner_is_user': {
              'fr': 'Est utilisateur',
              'nl': '',
              'en': '',
            },
            'access_planner_is_user_hint': {
              'fr': 'Peut changer le statut des tâches et des sous-tâches.',
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
            'access_watcher_is_user': {
              'fr': 'Est utilisateur',
              'nl': '',
              'en': '',
            },
            'access_watcher_is_user_hint': {
              'fr': 'Peut changer le statut des tâches et des sous-tâches.',
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
            'access_info_profile_exists': {
              'fr': 'Un ou plusieurs profil avec le même nom ont été trouvés. Êtes-vous sûr(e) qu\'il ne s\'agit pas d\'un des ces utilisateurs:',
              'nl': '',
              'en': '',
            },
            'access_warning_user_exists': {
              'fr': 'Avant de créer un nouvel utilisateur, assurez-vous qu\'il n\'existe pas. Sinon, utilisez le champ "Ajouter un utilisateur exisitant".',
              'nl': '',
              'en': '',
            },
            'access_give_all_access': {
              'fr': 'Donner tous les accès',
              'nl': '',
              'en': 'Give all access',
            },
            'access_remove_all_access': {
              'fr': 'Retirer tous les accès',
              'nl': '',
              'en': 'Remove all access',
            },
          },
          'myapex': {
            'my_applications': {
              'fr': 'Mes applications',
              'nl': '',
              'en': '',
            },
            'not_installed_apps': {
              'fr': 'Applications pas encore installées',
              'nl': '',
              'en': '',
            },
            'install_apps': {
              'fr': 'Installer des applications',
              'nl': '',
              'en': '',
            },
          },
          'nexus': {
            'select_date': {
              'fr': 'Sélectionner une date',
              'nl': '',
              'en': '',
            },
            'add_new_contact': {
              'fr': 'Ajouter un nouveau contact',
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
            'calendar_show_all_quotas': {
              'fr': 'Afficher tous les quotas',
              'nl': '',
              'en': '',
            },
            'paint_border': {
              'fr': 'Colorer les bordures de cellules',
              'nl': '',
              'en': '',
            },
            'paint_cell': {
              'fr': 'Colorer l\'intérieur des cellules',
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
            'leaves_config': {
              'fr': 'Configuration des congés',
              'nl': '',
              'en': '',
            },
            'leaves_no_leave_set_1': {
              'fr': 'Il n\'y a pas encore de types de congé configurés pour cette équipe.',
              'nl': '',
              'en': '',
            },
            'leaves_no_leave_set_2': {
              'fr': 'Pour en ajouter, cliquez sur le bouton turquoise en haut de page.',
              'nl': '',
              'en': '',
            },
            'leaves_leave_name': {
              'fr': 'Nom du congé',
              'nl': '',
              'en': '',
            },
            'leaves_leave_desc': {
              'fr': 'Déscription du congé',
              'nl': '',
              'en': '',
            },
            'leaves_leave_color': {
              'fr': 'Couleur du congé',
              'nl': '',
              'en': '',
            },
            'leaves_leave_type': {
              'fr': 'Type de congé',
              'nl': '',
              'en': '',
            },
            'leaves_leave_count': {
              'fr': 'Nombre de types de congés',
              'nl': '',
              'en': '',
            },
            'leaves_remove_leave_type': {
              'fr': 'Retirer un type de congé',
              'nl': '',
              'en': '',
            },
            'leaves_remove_leave_type_warning': {
              'fr': 'Attention, si vous supprimez ce type de congé, vous supprimerez églamenent les quotas associés des membres de l\'équipe.',
              'nl': '',
              'en': '',
            },
            'leaves_add_leave_type': {
              'fr': 'Ajouter un type de congé',
              'nl': '',
              'en': '',
            },
            'calls_title': {
              'fr': 'Récapitulatif des interventions',
              'nl': '',
              'en': '',
            },
            'calls_worker': {
              'fr': 'Agent',
              'nl': '',
              'en': '',
            },
            'calls_kind': {
              'fr': 'Type',
              'nl': '',
              'en': '',
            },
            'calls_d27': {
              'fr': 'D27',
              'nl': '',
              'en': '',
            },
            'calls_with_d27': {
              'fr': 'Avec D27',
              'nl': '',
              'en': '',
            },
            'calls_no_call': {
              'fr': 'Pas d\'intervention',
              'nl': '',
              'en': '',
            },
            'quota_base_quota': {
              'fr': 'Droit de base',
              'nl': '',
              'en': '',
            },
            'quota_took': {
              'fr': 'Pris',
              'nl': '',
              'en': '',
            },
            'quota_obtained': {
              'fr': 'Obtenu',
              'nl': '',
              'en': '',
            },
            'quota_left': {
              'fr': 'Reste',
              'nl': '',
              'en': '',
            },
          },
          'radium': {
            'palette_works_tooltip': {
              'fr': 'Colorer les chantier',
              'nl': '',
              'en': 'Color works',
            },
            'filter_works_tooltip': {
              'fr': 'Filtrer les chantiers',
              'nl': '',
              'en': 'Filter works',
            },
            'sort_works_tooltip': {
              'fr': 'Trier les chantiers',
              'nl': '',
              'en': 'Sort works',
            },
            'sort_works_by_placeholder': {
              'fr': 'Trier les chantiers par',
              'nl': '',
              'en': 'Sort works by',
            },
            'original_order': {
              'fr': 'Ordre original',
              'nl': '',
              'en': 'Original order',
            },
            'sort_works_by_increasing_day_tooltip': {
              'fr': 'Trier les chantiers par jour croissant',
              'nl': '',
              'en': 'Sort works by increasing day',
            },
            'printable_tooltip': {
              'fr': 'Liste imprimable des chantier du mois',
              'nl': '',
              'en': 'Printable list of works of this month',
            },
            'customize_tooltip': {
              'fr': 'Personnaliser Radium',
              'nl': '',
              'en': 'Customize Radium',
            },
            'add_work_tooltip': {
              'fr': 'Ajouter un chantier',
              'nl': '',
              'en': 'Add work',
            },
            'show_messages_tooltip': {
              'fr': 'Afficher les messages',
              'nl': '',
              'en': 'Show messages',
            },
            'column_title_shifts': {
              'fr': 'Prestations',
              'nl': '',
              'en': 'Shifts',
            },
            'column_title_dates': {
              'fr': 'Dates',
              'nl': '',
              'en': 'Dates',
            },
            'column_title_schedules': {
              'fr': 'Horaires',
              'nl': '',
              'en': 'Schedules',
            },
            'column_title_description': {
              'fr': 'Description',
              'nl': '',
              'en': 'Description',
            },
            'column_title_note': {
              'fr': 'Remarques',
              'nl': '',
              'en': 'Note',
            },
            'column_title_ilt': {
              'fr': 'ILT',
              'nl': '',
              'en': '???',
            },
            'column_title_files': {
              'fr': 'Fichiers',
              'nl': '',
              'en': 'Files',
            },
            'column_title_ilts': {
              'fr': 'ILT',
              'nl': '',
              'en': '???',
            },
            'column_title_bnxs': {
              'fr': 'BNX',
              'nl': '',
              'en': '???',
            },
            'column_title_fmhts': {
              'fr': 'FMHT',
              'nl': '',
              'en': '???',
            },
            'column_title_others': {
              'fr': 'Divers',
              'nl': '',
              'en': 'Others',
            },
            'column_title_upm': {
              'fr': 'UPM',
              'nl': '',
              'en': 'UPM',
            },
            'column_title_colt': {
              'fr': 'CoLT',
              'nl': '',
              'en': 'CoLT',
            },
            'column_title_status': {
              'fr': 'Statut',
              'nl': '',
              'en': 'Status',
            },
            'column_title_limits': {
              'fr': 'Limites de mise hors service',
              'nl': '',
              'en': 'Limits',
            },
            'column_title_s460s': {
              'fr': 'S460',
              'nl': '',
              'en': 'S460',
            },
            'column_title_zkl': {
              'fr': 'ZKL',
              'nl': '',
              'en': 'ZKL',
            },
            'column_title_cascat': {
              'fr': 'Cas caténaire',
              'nl': '',
              'en': 'CC',
            },
            'column_title_grue': {
              'fr': 'Grue RR',
              'nl': '',
              'en': 'Backhoe',
            },
            'column_title_osv': {
              'fr': 'OSV',
              'nl': '',
              'en': 'OSV',
            },
            'column_title_loco': {
              'fr': 'Loco',
              'nl': '',
              'en': 'Loco',
            },
            'column_title_hgs': {
              'fr': 'HGS',
              'nl': '',
              'en': 'HGS',
            },
            'column_title_soudure': {
              'fr': 'Soudure',
              'nl': '',
              'en': 'Welding',
            },
            'column_title_pn': {
              'fr': 'PN',
              'nl': '',
              'en': 'RC',
            },
            'column_title_art': {
              'fr': 'ART',
              'nl': '',
              'en': 'TSN',
            },
            'column_title_s428': {
              'fr': 'S428',
              'nl': '',
              'en': 'S428',
            },
            'column_title_s461': {
              'fr': 'S461',
              'nl': '',
              'en': 'S461',
            },
            'column_title_atwtx': {
              'fr': 'ATW-Tx',
              'nl': '',
              'en': 'ATW-Tx',
            },
            'column_title_imputation': {
              'fr': 'Imputation',
              'nl': '',
              'en': 'Imputation',
            },
            'column_title_extra': {
              'fr': 'Divers',
              'nl': '',
              'en': 'Extra',
            },
            'column_title_supervisor': {
              'fr': 'Responsable',
              'nl': '',
              'en': 'Supervisor',
            },
            'column_title_line': {
              'fr': 'Ligne',
              'nl': '',
              'en': 'Line',
            },
            'edit_tooltip': {
              'fr': 'Déverrouiller et modifier ce chantier',
              'nl': '',
              'en': 'Unlock and edit this work',
            },
            'lock_tooltip': {
              'fr': 'Verrouiller ce chantier',
              'nl': '',
              'en': 'Lock this work',
            },
            'delete_tooltip': {
              'fr': 'Supprimer ce chantier',
              'nl': '',
              'en': 'Delete this work',
            },
            'message_tooltip': {
              'fr': 'Envoyer un message concernant ce chantier',
              'nl': '',
              'en': 'Send a message about this work',
            },
            'copy_tooltip': {
              'fr': 'Créer une copie de ce chantier ici ou dans un autre mois',
              'nl': '',
              'en': 'Create a copy of this work here or in another month',
            },
            'move_tooltip': {
              'fr': 'Déplacer ce chantier dans un autre mois',
              'nl': '',
              'en': 'Move this work to another month',
            },
            'link_radiums_tooltip': {
              'fr': 'Lier ce chantier à d\'autres Radium',
              'nl': '',
              'en': 'Link this work to other Radium',
            },
            'link_radiums_snackbar': {
              'fr': 'Ce chantier à bien été liés aux Radium sélectionnés.',
              'nl': '',
              'en': 'This work has been successfully linked to selected Radium.',
            },
            'link_teams_tooltip': {
              'fr': 'Ajouter des équipes à cette prestation',
              'nl': '',
              'en': 'Add teams to this shift',
            },
            'participating_teams': {
              'fr': 'Equipes participantes au chantier',
              'nl': '',
              'en': 'Teams participating in the work',
            },
            'part_needs': {
              'fr': 'Besoin de',
              'nl': '',
              'en': 'Need',
            },
            'participating_profiles': {
              'fr': 'Agents participants',
              'nl': '',
              'en': 'Participating people',
            },
            'no_participating_teams': {
              'fr': 'Aucune équipe ne participe à cette prestation.',
              'nl': '',
              'en': 'No team participates in this shift.',
            },
            'no_shift': {
              'fr': 'Pas encore de prestation pour ce chantier.',
              'nl': '',
              'en': 'No shift for this work yet.',
            },
            'no_shift_date': {
              'fr': 'Veuillez introduire une date à cette prestation pour ajouter une équipe.',
              'nl': '',
              'en': 'Please enter a date for this shift to add a team.',
            },
            'remove_project': {
              'fr': 'Supprimer le lien vers le projet Draft',
              'nl': '',
              'en': 'Remove the link to the Draft project',
            },
            'remove_part': {
              'fr': 'Supprimer la participation de l\'équipe',
              'nl': '',
              'en': 'Send a message to team members',
            },
            'send_team_message': {
              'fr': 'Envoyer un message aux membres de l\'équipe',
              'nl': '',
              'en': '',
            },
            'lock_part': {
              'fr': 'Verrouiller la participation',
              'nl': '',
              'en': 'Lock participation',
            },
            'unlock_part': {
              'fr': 'Déverrouiller la participation',
              'nl': '',
              'en': 'Unlock participation',
            },
            'locked_part': {
              'fr': 'Cette participation est verrouillée.',
              'nl': '',
              'en': 'This participation is locked.',
            },
            'short_override': {
              'fr': 'Écraser la troisième case des cellules Watcher',
              'nl': '',
              'en': 'Overwrite the third cells box',
            },
            'part_description': {
              'fr': 'Description du travail pour cette équipe',
              'nl': '',
              'en': 'Work description for this team',
            },
            'short_override_confirm': {
              'fr': 'La troisième case des cellules des participants ont bien été écrasées dans le calendrier Watcher.',
              'nl': '',
              'en': 'The third box of the participants\' cells has been overwritten in the Watcher calendar.',
            },
            'log_title': {
              'fr': 'Historique des modifications de la cellule',
              'nl': '',
              'en': 'History of cell updates',
            },
            'log_no_log': {
              'fr': 'Pas de modification pour cette cellule.',
              'nl': '',
              'en': 'No update for this cell.',
            },
            'no_works': {
              'fr': 'Il n\'y a pas encore de chantier ce mois.',
              'nl': '',
              'en': 'There is no work yet this month.',
            },
            'no_filters_result': {
              'fr': 'Il n\'y a pas de chantier correspondant aux filtres appliqués.',
              'nl': '',
              'en': 'There is no work corresponding to the filters applied.',
            },
            'message_to_linked_radiums': {
              'fr': 'Envoyer ce message aux Radium liés :',
              'nl': '',
              'en': 'Send this message to linked Radium :',
            },
            'message_presets': {
              'fr': 'Messages prédéfinis',
              'nl': '',
              'en': 'Preset messages',
            },
            'message_preset_work_added': {
              'fr': 'Un nouveau chantier a été ajouté.',
              'nl': '',
              'en': 'A new work has been added.',
            },
            'message_preset_date_updated': {
              'fr': 'La date du chantier a été modifiée.',
              'nl': '',
              'en': 'The work\'s date has been updated.',
            },
            'message_preset_shift_updated': {
              'fr': 'La prestation du chantier à été modifiée.',
              'nl': '',
              'en': 'The work\'s shift has been updated.',
            },
            'message_preset_desc_updated': {
              'fr': 'La description du chantier a été mise à jour.',
              'nl': '',
              'en': 'The work\'s description has been updated.',
            },
            'message_preset_note_added': {
              'fr': 'Une remarque a été ajoutée.',
              'nl': '',
              'en': 'A note has been added.',
            },
            'message_preset_bnx_added': {
              'fr': 'Un nouveau BNX a été publié.',
              'nl': '',
              'en': 'A new ??? has been published.',
            },
            'message_preset_ilt_added': {
              'fr': 'Une nouvelle ILT a été publiée.',
              'nl': '',
              'en': 'A new ??? has been published.',
            },
            'message_preset_work_canceled': {
              'fr': 'Le chantier est annulé.',
              'nl': '',
              'en': 'The work is canceled.',
            },
            'messages_dialog_title': {
              'fr': 'Messages concernant les chantiers de ce Radium',
              'nl': '',
              'en': 'Radium\'s works\' messages',
            },
            'messages_work_date': {
              'fr': 'Chantier du',
              'nl': '',
              'en': 'Work of',
            },
            'messages_no_message': {
              'fr': 'Pas de message pour le moment.',
              'nl': '',
              'en': 'No message yet',
            },
            'paint_works': {
              'fr': 'Colorer les chantiers',
              'nl': '',
              'en': 'Color works',
            },
            'paint_columns_bg': {
              'fr': 'Colorer la couleur de fond des colonnes',
              'nl': '',
              'en': 'Color columns background',
            },
            'paint_columns_text': {
              'fr': 'Colorer le texte des colonnes',
              'nl': '',
              'en': 'Color columns text',
            },
            'paint_rows_bg': {
              'fr': 'Colorer la couleur de fond des lignes',
              'nl': '',
              'en': 'Color row background',
            },
            'paint_rows_text': {
              'fr': 'Colorer le texte des lignes',
              'nl': '',
              'en': 'Color row text',
            },
            'line': {
              'fr': 'Ligne',
              'nl': '',
              'en': 'Line',
            },
            'station': {
              'fr': 'Gare',
              'nl': '',
              'en': 'Station',
            },
            'lane': {
              'fr': 'Voie',
              'nl': '',
              'en': 'Lane',
            },
            'signal': {
              'fr': 'Signal',
              'nl': '',
              'en': 'Signal',
            },
            'pk': {
              'fr': 'PK',
              'nl': '',
              'en': '',
            },
            'from': {
              'fr': 'De',
              'nl': '',
              'en': 'From',
            },
            'to': {
              'fr': 'À',
              'nl': '',
              'en': 'To',
            },
            'printable_works': {
              'fr': 'Chantiers',
              'nl': '',
              'en': 'Works',
            },
          },
          'planner': {
            'to_be_planned': {
              'fr': 'A planifier',
              'nl': '',
              'en': 'To be planned',
            },
            'planned': {
              'fr': 'Planifié',
              'nl': '',
              'en': 'Planned',
            },
            'printable_board': {
              'fr': 'Version imprimable du planning',
              'nl': '',
              'en': 'Printable version of the schedule',
            },
            'edit_teammates': {
              'fr': 'Modifier les agents participants',
              'nl': '',
              'en': 'Edit participating people',
            },
            'add_foreign_user': {
              'fr': 'Ajouter un membre d\'une autre équipe',
              'nl': '',
              'en': 'Add a member of another team',
            },
            'planning': {
              'fr': 'Planning',
              'nl': '',
              'en': 'Schedule',
            },
            'folders_setting': {
              'fr': 'Gestion des dossiers',
              'nl': '',
              'en': 'Forlers setting',
            },
            'folder_name': {
              'fr': 'Nom du dossier',
              'nl': '',
              'en': 'Folder name',
            },
            'add_folder': {
              'fr': 'Ajouter un dossier',
              'nl': '',
              'en': 'Add folder',
            },
            'delete_folder': {
              'fr': 'Supprimer ce dossier',
              'nl': '',
              'en': 'Delete folder',
            },
            'delete_folder_warning': {
              'fr': 'Attention, il existe des éléments dans ce dossier. Si vous le supprimez, tous les éléments de ce dossier seront également supprimés.',
              'nl': '',
              'en': 'Please note that there are elements in this folder. If you delete it, all elements in that folder will also be deleted.',
            },
          },
          'draft': {
            'ongoing_projects': {
              'fr': 'Projets en cours',
              'nl': '',
              'en': 'On going projects',
            },
            'archived_projects': {
              'fr': 'Projets archivés',
              'nl': '',
              'en': 'Archived projects',
            },
            'create_new_project': {
              'fr': 'Créer un nouveau projet',
              'nl': '',
              'en': 'Create a new project',
            },
            'tip_no_ongoing_project': {
              'fr': 'Il n\'y a pas de projet en cours.',
              'nl': '',
              'en': 'There is no on going project.',
            },
            'tip_create_new_project': {
              'fr': 'Créez-en un nouveau en cliquant sur le bouton « + ».',
              'nl': '',
              'en': 'Create one by clicking on the button « + ».',
            },
            'tip_no_archived_project': {
              'fr': 'Il n\'y a pas de projet archivé.',
              'nl': '',
              'en': 'There is no archived project.',
            },
            'project_name': {
              'fr': 'Nom du projet',
              'nl': '',
              'en': 'Project\'s name',
            },
            'project_date': {
              'fr': 'Début du projet',
              'nl': '',
              'en': 'Project\'s start date',
            },
            'add_task': {
              'fr': 'Ajouter une tâche',
              'nl': '',
              'en': 'Add task',
            },
            'edit_project': {
              'fr': 'Editer le projet',
              'nl': '',
              'en': 'Edit project',
            },
            'ongoing': {
              'fr': 'En cours',
              'nl': '',
              'en': 'On going',
            },
            'archived': {
              'fr': 'Archivé',
              'nl': '',
              'en': 'Archived',
            },
            'private': {
              'fr': 'Privé',
              'nl': '',
              'en': 'Private',
            },
            'public': {
              'fr': 'Public',
              'nl': '',
              'en': 'public',
            },
            'delete_project': {
              'fr': 'Supprimer le projet',
              'nl': '',
              'en': 'Delete project',
            },
            'delete_project_warning': {
              'fr': 'Attention, tous les éléments de ce projet seront supprimés de façon permanente.',
              'nl': 'Warning, every elements in this project will be permanently deleted.',
              'en': 'Delete project',
            },
            'delete_project_info': {
              'fr': 'Si un projet est terminé, vous pouvez aussi l\'archiver. Vous concerverez ainsi le projet, mais il n\'apparaîtra plus dans la liste des projets en cours.',
              'nl': 'If you no longer need this project, you can also archive it. This will keep the project, but it will no longer appear in the list of on going projects.',
              'en': 'Delete project',
            },
            'private_hint': {
              'fr': 'Seules les personnes autorisées peuvent consulter ce projet.',
              'nl': '',
              'en': 'Only authorized users can view this project.',
            },
            'archived_hint': {
              'fr': 'Le projet se trouve dans la liste des projets archivés.',
              'nl': '',
              'en': 'The project is in the list of archived projects.',
            },
            'tip_no_filtered_task': {
              'fr': 'Il n\'y a pas de tâche correspondante aux filtres sélectionnés',
              'nl': '',
              'en': 'There is no task corresponding to the selected filters',
            },
            'tip_no_task_1': {
              'fr': 'Il n\'y a pas encore de tâche dans ce projet.',
              'nl': '',
              'en': 'There is no task in this project yet.',
            },
            'tip_no_task_2': {
              'fr': 'Pour en ajouter, activez le mode édition en cliquant sur le bouton en bas à droite de la page puis sur le bouton « + ».',
              'nl': '',
              'en': 'To add some, enable the edit mode by clicking on the button at the bottom right of the page then on the button « + ».',
            },
            'enable_edit_mode': {
              'fr': 'Basculer en mode édition',
              'nl': '',
              'en': 'Enable edit mode',
            },
            'disable_edit_mode': {
              'fr': 'Désactiver le mode édition',
              'nl': '',
              'en': 'Disable edit mode',
            },
            'task_name': {
              'fr': 'Nom de la tâche',
              'nl': '',
              'en': 'Tsak name',
            },
            'task_status': {
              'fr': 'Statut',
              'nl': '',
              'en': 'Status',
            },
            'initial_order': {
              'fr': 'Ordre initial',
              'nl': '',
              'en': 'Initial order',
            },
            'task_models': {
              'fr': 'Modèles de tâche',
              'nl': '',
              'en': 'Task models',
            },
            'add_template': {
              'fr': 'Créer un modèle',
              'nl': '',
              'en': 'Create model',
            },
            'no_template': {
              'fr': 'Il n\'y a pas encore de modèle.',
              'nl': '',
              'en': 'There is no model yet.',
            },
          },
        },
      },

      language_cookie: null,
    }
  },

  created() {

  },

  computed: {

  },

  methods: {

  },
}

</script>
