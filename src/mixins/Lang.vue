<script>

export default {
  data() {
    return {
      lang: {
        "generic":{
          "email":{
            "fr": "Adresse email",
            "nl": "E-mailadres",
            "en": "Email address"
          },
          "password":{
            "fr": "Mot de passe",
            "nl": "Wachtwoord",
            "en": "Password"
          },
          "send":{
            "fr": "Envoyer",
            "nl": "Sturen",
            "en": "Send"
          },
          "save":{
            "fr": "Enregistrer",
            "nl": "Opslaan",
            "en": "Save"
          },
          "apply":{
            "fr": "Appliquer",
            "nl": "Toepassen",
            "en": "Apply"
          },
          "add":{
            "fr": "Ajouter",
            "nl": "Toevoegen",
            "en": "Add"
          },
          "delete":{
            "fr": "Supprimer",
            "nl": "Verwijderen",
            "en": "Delete"
          },
          "remove":{
            "fr": "Retirer",
            "nl": "Terugtrekken",
            "en": "Remove"
          },
          "move":{
            "fr": "Déplacer",
            "nl": "Verplaatsen",
            "en": "Move"
          },
          "replace":{
            "fr": "Remplacer",
            "nl": "Vervangen",
            "en": "Replace"
          },
          "restore":{
            "fr": "Restaurer",
            "nl": "Herstellen",
            "en": "Restore"
          },
          "sort":{
            "fr": "Trier",
            "nl": "Sorteren",
            "en": "Sort"
          },
          "filter":{
            "fr": "Filtrer",
            "nl": "Filter",
            "en": "Filter"
          },
          "update_position":{
            "fr": "Changer l'ordre",
            "nl": "Order veranderen",
            "en": "Change order"
          },
          "needs":{
            "fr": "Besoins",
            "nl": "Behoeften",
            "en": "Needs"
          },
          "cancel":{
            "fr": "Annuler",
            "nl": "Annuleren",
            "en": "Cancel"
          },
          "confirm":{
            "fr": "Confirmer",
            "nl": "Bevestigen",
            "en": "Confirm"
          },
          "edit":{
            "fr": "Modifier",
            "nl": "Wijzegen",
            "en": "Edit"
          },
          "lock":{
            "fr": "Verrouiller",
            "nl": "Vergrendelen",
            "en": "Lock"
          },
          "unlock":{
            "fr": "Déverrouiller",
            "nl": "Ontgrendelen",
            "en": "Unlock"
          },
          "acquit":{
            "fr": "Acquitter",
            "nl": "Financiële prestaties",
            "en": "Acquit"
          },
          "create":{
            "fr": "Créer",
            "nl": "Creeren",
            "en": "Create"
          },
          "go":{
            "fr": "Aller",
            "nl": "Gaan",
            "en": "Go"
          },
          "visit":{
            "fr": "Visiter",
            "nl": "Bezoeken",
            "en": "Visit"
          },
          "define":{
            "fr": "Definir",
            "nl": "Definiëren",
            "en": "Define"
          },
          "override":{
            "fr": "Écraser",
            "nl": "verpleteren",
            "en": "Override"
          },
          "to_copy":{
            "fr": "Copier",
            "nl": "Kopieren",
            "en": "Copy"
          },
          "to_link":{
            "fr": "Lier",
            "nl": "Verbinden",
            "en": "Link"
          },
          "connection":{
            "fr": "Connexion",
            "nl": "Inloggen",
            "en": "Connection"
          },
          "disconnect":{
            "fr": "Déconnexion",
            "nl": "Uitloggen",
            "en": "Disconnect"
          },
          "change_password":{
            "fr": "Changer de mot de passe",
            "nl": "Verander het wachtwoord",
            "en": "Change password"
          },
          "name":{
            "fr": "Nom",
            "nl": "Naam",
            "en": "Nome"
          },
          "ident":{
            "fr": "Numéro d'identification",
            "nl": "Identificatienummer",
            "en": "Identification number"
          },
          "phone":{
            "fr": "Numéro de téléphone",
            "nl": "Telefoonnummer",
            "en": "Phone number"
          },
          "grade":{
            "fr": "Grade",
            "nl": "Graad",
            "en": "Grade"
          },
          "field":{
            "fr": "Spécialité",
            "nl": "Specialiteit",
            "en": "Field"
          },
          "url":{
            "fr": "URL",
            "nl": "URL",
            "en": "URL"
          },
          "coordinates":{
            "fr": "Coordonées",
            "nl": "Gegevens",
            "en": "Coordinates"
          },
          "not_empty_field":{
            "fr": "Ce champ ne peut pas être vide.",
            "nl": "Dit veld mag niet leeg zijn.",
            "en": "This field cannot be empty."
          },
          "no_result":{
            "fr": "Aucun résultat",
            "nl": "Geen enkel resultaat",
            "en": "No result"
          },
          "shift":{
            "fr": "Prestation",
            "nl": "Prestatie",
            "en": "Shift"
          },
          "by_author_on_date":{
            "fr": "Par ### le @@@",
            "nl": "Door ### de @@@",
            "en": "By ### the @@@"
          },
          "edit_options":{
            "fr": "Options d'édition",
            "nl": "Editing opties",
            "en": "Editing options"
          },
          "empty_note":{
            "fr": "Note vide",
            "nl": "Lege notitie",
            "en": "Empty note"
          },
          "empty_task":{
            "fr": "Tâche vide",
            "nl": "Lege taak",
            "en": "Empty task"
          },
          "empty_subtask":{
            "fr": "Sous-tâche vide",
            "nl": "Lege subtaak",
            "en": "Empty subtask"
          },
          "file_name":{
            "fr": "Nom du fichier",
            "nl": "Bestandsnaam",
            "en": "File name"
          },
          "team":{
            "fr": "Équipe",
            "nl": "Ploeg",
            "en": "Team"
          },
          "start":{
            "fr": "Début",
            "nl": "Begin",
            "en": "Start"
          },
          "end":{
            "fr": "Fin",
            "nl": "Einde.",
            "en": "End"
          },
          "are_you_sure":{
            "fr": "Êtes-vous sûr(e) ?",
            "nl": "Weet je het zeker?",
            "en": "Are you sure ?"
          },
          "bnx":{
            "fr": "BNX",
            "nl": "BNX?:",
            "en": "BNX?"
          },
          "ilt":{
            "fr": "ILT",
            "nl": "ILT?",
            "en": "ILT?"
          },
          "hour":{
            "fr": "Heure",
            "nl": "Uur",
            "en": "Hour"
          },
          "minute":{
            "fr": "Minute",
            "nl": "Minuut",
            "en": "Minute"
          },
          "decimal":{
            "fr": "Décimale",
            "nl": "Decimale",
            "en": "Decimal"
          },
          "day":{
            "fr": "Jour",
            "nl": "Dag",
            "en": "Day"
          },
          "day_alt":{
            "fr": "Journée",
            "nl": "Dag",
            "en": "Day"
          },
          "previous_day":{
            "fr": "Jour précédent",
            "nl": "Vorige dag",
            "en": "Previous day"
          },
          "next_day":{
            "fr": "Jour suivant",
            "nl": "Volgende dag",
            "en": "Next day"
          },
          "week":{
            "fr": "Semaine",
            "nl": "Week",
            "en": "Week"
          },
          "schedule":{
            "fr": "Horaire",
            "nl": "Uurrooster",
            "en": "Schedule"
          },
          "month":{
            "fr": "Mois",
            "nl": "Maand",
            "en": "Month"
          },
          "previous_month":{
            "fr": "Mois précédent",
            "nl": "Vorige maand",
            "en": "Previous month"
          },
          "next_month":{
            "fr": "Mois suivant",
            "nl": "Volgende maand",
            "en": "Next month"
          },
          "year":{
            "fr": "Année",
            "nl": "Jaar",
            "en": "Year"
          },
          "previous_year":{
            "fr": "Année précédente",
            "nl": "Vorig jaar",
            "en": "Previous year"
          },
          "next_year":{
            "fr": "Année suivante",
            "nl": "Volgend jaar",
            "en": "Next year"
          },
          "date":{
            "fr": "Date",
            "nl": "Datum",
            "en": "Date"
          },
          "january":{
            "fr": "Janvier",
            "nl": "Januari",
            "en": "January"
          },
          "february":{
            "fr": "Février",
            "nl": "Februari",
            "en": "February"
          },
          "march":{
            "fr": "Mars",
            "nl": "Maart",
            "en": "March"
          },
          "april":{
            "fr": "Avril",
            "nl": "April",
            "en": "April"
          },
          "may":{
            "fr": "Mai",
            "nl": "May",
            "en": "May"
          },
          "june":{
            "fr": "Juin",
            "nl": "Juni",
            "en": "June"
          },
          "july":{
            "fr": "Juillet",
            "nl": "Juli",
            "en": "July"
          },
          "august":{
            "fr": "Août",
            "nl": "Augustus",
            "en": "August"
          },
          "september":{
            "fr": "Septembre",
            "nl": "September",
            "en": "September"
          },
          "october":{
            "fr": "Octobre",
            "nl": "Oktober",
            "en": "October"
          },
          "november":{
            "fr": "Novembre",
            "nl": "November",
            "en": "November"
          },
          "december":{
            "fr": "Décembre",
            "nl": "December",
            "en": "December"
          },
          "monday":{
            "fr": "lundi",
            "nl": "Maandag",
            "en": "Monday"
          },
          "tuesday":{
            "fr": "mardi",
            "nl": "Dinsdag",
            "en": "Tuesday"
          },
          "wednesday":{
            "fr": "mercredi",
            "nl": "Woensdag",
            "en": "Wednesday"
          },
          "thursday":{
            "fr": "jeudi",
            "nl": "Donderdag",
            "en": "Thursday"
          },
          "friday":{
            "fr": "vendredi",
            "nl": "Vrijdag",
            "en": "Friday"
          },
          "saturday":{
            "fr": "Samedi",
            "nl": "Zaterdag",
            "en": "saturday"
          },
          "sunday":{
            "fr": "Dimanche",
            "nl": "Zondag",
            "en": "Sunday"
          },
          "holiday":{
            "fr": "Férié",
            "nl": "Vakantie",
            "en": "Holiday"
          },
          "counter":{
            "fr": "Compteur",
            "nl": "Teller",
            "en": "Counter"
          },
          "counter_sick":{
            "fr": "Maladie",
            "nl": "Ziekte.",
            "en": "Sick"
          },
          "counter_special":{
            "fr": "Circonstance",
            "nl": "Omstandigheid.",
            "en": "Counter"
          },
          "counter_unjustified":{
            "fr": "Injustifié",
            "nl": "Onwettig.",
            "en": "Counter"
          },
          "counter_strike":{
            "fr": "Grève",
            "nl": "Staking.",
            "en": "Strike"
          },
          "counter_wounded":{
            "fr": "Blessé",
            "nl": "Gewond",
            "en": "Wounded"
          },
          "ignore":{
            "fr": "Ignoré",
            "nl": "Genegeerd",
            "en": "Ignored"
          },
          "pending":{
            "fr": "En attente",
            "nl": "In afwachting",
            "en": "Pending"
          },
          "normal_leave":{
            "fr": "Congés normaux",
            "nl": "Normaal verlof",
            "en": "Normal leaves"
          },
          "credit_day":{
            "fr": "Jours de crédit",
            "nl": "Kredietdagen",
            "en": "Credit days"
          },
          "variable_leave":{
            "fr": "Congés variables",
            "nl": "Variabel verlof",
            "en": "Variable leave days"
          },
          "working":{
            "fr": "En cours",
            "nl": "Bezig",
            "en": "Working"
          },
          "done":{
            "fr": "Terminé",
            "nl": "Voltooid",
            "en": "Done"
          },
          "canceled":{
            "fr": "Annulé",
            "nl": "Geannuleerd",
            "en": "Canceled"
          },
          "print":{
            "fr": "Imprimer",
            "nl": "Uitprinten.",
            "en": "Print"
          },
          "expand":{
            "fr": "Développer",
            "nl": "Ontwikkelen",
            "en": "Expand"
          },
          "presence":{
            "fr": "Présence",
            "nl": "Aanwezigheid",
            "en": "Presence"
          },
          "presences":{
            "fr": "Présences",
            "nl": "Aanwezigheid",
            "en": "Presences"
          },
          "absence":{
            "fr": "Absence",
            "nl": "Afwezigheid",
            "en": "Absence"
          },
          "absences":{
            "fr": "Absences",
            "nl": "Afwezigheid",
            "en": "Absences"
          },
          "recovery":{
            "fr": "Récupération",
            "nl": "Recup",
            "en": "Recovery"
          },
          "message":{
            "fr": "Message",
            "nl": "Bericht",
            "en": "Message"
          },
          "task_no_element":{
            "fr": "Il n'y pas d'élément dans cette tâche.",
            "nl": "Er zijn geen gegevens in deze taak.",
            "en": "There is no element in this task."
          },
          "log":{
            "fr": "Historique",
            "nl": "Geschiedenis",
            "en": "History"
          },
          "text":{
            "fr": "Texte",
            "nl": "Tekst",
            "en": "Text"
          },
          "add_input_tooltip":{
            "fr": "Ajouter un champ de texte",
            "nl": "Voeg een textveld toe.",
            "en": "Add input field"
          },
          "loading":{
            "fr": "Chargement",
            "nl": "Laden",
            "en": "Loading"
          },
          "task":{
            "fr": "Tâche",
            "nl": "Taak",
            "en": "Task"
          },
          "tasks":{
            "fr": "Tâches",
            "nl": "Taken",
            "en": "Tasks"
          },
          "note":{
            "fr": "Note",
            "nl": "Notitie",
            "en": "Note"
          },
          "add_note_tooltip":{
            "fr": "Ajouter une note",
            "nl": "Voeg een notitie toe.",
            "en": "Add note"
          },
          "file":{
            "fr": "Fichier",
            "nl": "Bestand.",
            "en": "File"
          },
          "add_file_tooltip":{
            "fr": "Ajouter un fichier",
            "nl": "Voeg een bestand toe.",
            "en": "Add file"
          },
          "add_cats_tooltip":{
            "fr": "Ajouter un pointage CATS",
            "nl": "???",
            "en": "???"
          },
          "subtask":{
            "fr": "Sous-tâche",
            "nl": "Subtaak:",
            "en": "Subtask"
          },
          "add_subtask_tooltip":{
            "fr": "Ajouter une sous-tâche",
            "nl": "Voeg een subtaak toe",
            "en": "Add subtask"
          },
          "teams":{
            "fr": "Équipes",
            "nl": "Ploegen",
            "en": "Teams"
          },
          "log_edited_by":{
            "fr": "Modifié par",
            "nl": "Bewerkt door",
            "en": "Edited by"
          },
          "log_old_value":{
            "fr": "Ancienne valeur",
            "nl": "Oude waarde",
            "en": "Old value"
          },
          "log_new_value":{
            "fr": "Nouvelle valeur",
            "nl": "Nieuwe waarde",
            "en": "New value"
          },
          "log_datetime":{
            "fr": "Date de la modification",
            "nl": "Datum laatste wijzeging",
            "en": "Edit date"
          },
          "visible":{
            "fr": "Visible",
            "nl": "Zichtbaar",
            "en": "Visible"
          },
          "column_width":{
            "fr": "Largeur de la colonne",
            "nl": "Breedte van de kolom",
            "en": "Column width"
          },
          "text_size":{
            "fr": "Taille du texte",
            "nl": "Tekstmaat",
            "en": "Text size"
          },
          "calendar":{
            "fr": "Calendrier",
            "nl": "Kalender",
            "en": "Calendar"
          },
          "input_short":{
            "fr": "Texte court",
            "nl": "Korte tekst",
            "en": "Short text"
          },
          "input_long":{
            "fr": "Texte long",
            "nl": "Lange tekst",
            "en": "Long text"
          },
          "input_title":{
            "fr": "Titre",
            "nl": "Titel",
            "en": "Title"
          },
          "input_date":{
            "fr": "Date",
            "nl": "Datum",
            "en": "Date"
          },
          "input_gps":{
            "fr": "Position GPS",
            "nl": "Positie GPS",
            "en": "GPS position"
          },
          "input_link":{
            "fr": "Lien",
            "nl": "Link",
            "en": "Link"
          },
          "input_value":{
            "fr": "Valeur",
            "nl": "Waarde",
            "en": "Value"
          },
          "models":{
            "fr": "Modèles",
            "nl": "Modellen",
            "en": "Models"
          },
          "printable_version":{
            "fr": "Version imprimable",
            "nl": "Printbare versie",
            "en": "Printable version"
          },
          "all":{
            "fr": "Tout",
            "nl": "Alles",
            "en": "Every"
          },
          "all_alt":{
            "fr": "Toutes",
            "nl": "Allemaal",
            "en": "Every"
          },
          "important":{
            "fr": "Important",
            "nl": "Belangrijk",
            "en": "Important"
          },
          "notice":{
            "fr": "Remarque",
            "nl": "Opmerking",
            "en": "Notice"
          },
          "code_presence":{
            "fr": "Code de présence",
            "nl": "???",
            "en": "???"
          },
          "code_work":{
            "fr": "Tâche",
            "nl": "???",
            "en": "???"
          },
          "code_place":{
            "fr": "Centre de coût",
            "nl": "???",
            "en": "???"
          },
          "code_hour":{
            "fr": "Heures",
            "nl": "???",
            "en": "???"
          },
          "code_start":{
            "fr": "Début",
            "nl": "???",
            "en": "???"
          },
          "code_end":{
            "fr": "Fin",
            "nl": "???",
            "en": "???"
          },
          "code_project":{
            "fr": "Code projet",
            "nl": "???",
            "en": "???"
          },
          "code_other":{
            "fr": "Autre",
            "nl": "???",
            "en": "???"
          },
          "code_activity":{
            "fr": "Activité",
            "nl": "???",
            "en": "???"
          },
          "code_network":{
            "fr": "Réseau",
            "nl": "???",
            "en": "???"
          },
          "code_cats":{
            "fr": "CATS",
            "nl": "CATS",
            "en": "CATS"
          },
        },




        "views":{
          "login":{
            "forgot_password":{
              "fr": "Mot de passe oublié ?",
              "nl": "Wachtwoord vergeten ?",
              "en": "Forgot password ?"
            },
            "back_to_login":{
              "fr": "Retour à l'écran de connexion",
              "nl": "Terug naar beginscherm",
              "en": "Back to connection screen"
            },
            "error_message":{
              "fr": "L'adresse email ou le mot de passe est incorrect.",
              "nl": "Het e-mailadres of wachtwoord is niet correct.",
              "en": "The email address or password is incorrect."
            },
            "error_message_reset":{
              "fr": "L'adresse email n'existe pas.",
              "nl": "Het e-mailadres bestaat niet.",
              "en": "The email address does not exist."
            },
            "success_message_reset":{
              "fr": "Votre nouveau mot de passe a été envoyé par email.",
              "nl": "Je nieuwe wachtwoord is per e-mail verstuurd.",
              "en": "Your new password has been sent by email."
            },
            "reset_password_title":{
              "fr": "Réinitialiser votre mot de passe",
              "nl": "Herstel je wachtwoord",
              "en": "Reset your password"
            },
            "reset_password_subtitle":{
              "fr": "(Vous receverez un nouveau mot de passe par email)",
              "nl": "(Je zal een nieuw wachtwoord per e-mail krijgen)",
              "en": "(You will receive a new password by email)"
            },
            "error_insert_email":{
              "fr": "Veuillez introduire une adresse email.",
              "nl": "Geef een e-mailadres.",
              "en": "Please enter an email address."
            },
            "error_format_email":{
              "fr": "Le format n'est pas valide.",
              "nl": "Het format is niet geldig.",
              "en": "The format is not valid."
            },
            "error_email_exist":{
              "fr": "Un profil utilise déjà cette adresse email.",
              "nl": "Een profiel gebruikt dit e-mailadres al.",
              "en": "A profile already uses this email address."
            },
            "error_insert_password":{
              "fr": "Veuillez introduire un mot de passe.",
              "nl": "Geef een wachtwoord.",
              "en": "Insert a password."
            }
          },




          "home":{
            "my_team":{
              "fr": "Mon équipe",
              "nl": "Mijn ploeg",
              "en": "My team"
            },
            "my_teams":{
              "fr": "Mes équipes",
              "nl": "Mijn ploegen",
              "en": "My teams"
            },
            "circles":{
              "fr": "Cercles",
              "nl": "Kringen",
              "en": "Circles"
            },
            "my_circle":{
              "fr": "Mon cercle",
              "nl": "Mijn cirkel",
              "en": "My circle"
            },
            "my_circles":{
              "fr": "Mes cercles",
              "nl": "Mijn kringen",
              "en": "My circles"
            },
            "change_password":{
              "fr": "Changement de mot de passe",
              "nl": "Wachtwoord verandert",
              "en": "Change password"
            },
            "current_password":{
              "fr": "Mot de passe actuel",
              "nl": "Huidig wachtwoord",
              "en": "Current password"
            },
            "new_password":{
              "fr": "Nouveau mot de passe",
              "nl": "Nieuw wachtwoord",
              "en": "New password"
            },
            "new_password_confirm":{
              "fr": "Confirmez le mot de passe",
              "nl": "Bevestig uw wachtwoord",
              "en": "Confirm new password"
            },
            "min_8_character":{
              "fr": "Minimum 8 caractères",
              "nl": "Minimum 8 karakters",
              "en": "8 characters minimum"
            },
            "password_change_success":{
              "fr": "Votre mot de passe a bien été changé.",
              "nl": "Je wachtwoord is veranderd.",
              "en": "Your password has been successfully updated."
            },
            "error_password_length":{
              "fr": "Votre mot de passe est trop court (minimum 8 caractères).",
              "nl": "Je wachtwoord is te kort.",
              "en": "Your password is too short (minimum 8 characters)."
            },
            "error_password_not_same":{
              "fr": "La confirmation de votre mot de passe est différente.",
              "nl": "Bevestiging van je wachtwoord is anders.",
              "en": "Confirmation of your password is different."
            },
            "error_password_bad":{
              "fr": "Votre mot de passe actuel est incorrect.",
              "nl": "Je huidig wachtwoord is niet correct.",
              "en": "Your current password is incorrect."
            },
            "select_language":{
              "fr": "Sélectionner votre langue",
              "nl": "Selecteer je taal",
              "en": "Select your language"
            },
            "language_french":{
              "fr": "Français",
              "nl": "Frans",
              "en": "French"
            },
            "language_english":{
              "fr": "Anglais",
              "nl": "Engels",
              "en": "English"
            },
            "language_dutch":{
              "fr": "Néérlandais",
              "nl": "Nederlands",
              "en": "Dutch"
            }
          },




          "team":{
            "draft_desc":{
              "fr": "Gestion de projets",
              "nl": "Projectmanagement",
              "en": "Project management"
            },
            "fleet_desc":{
              "fr": "Gestion des véhicules",
              "nl": "Beheer van de voertuigen",
              "en": "Vehicles management"
            },
            "planner_desc":{
              "fr": "Planificateur de travail",
              "nl": "Werkplanner",
              "en": "Work planner"
            },
            "radium_desc":{
              "fr": "Agenda de chantiers",
              "nl": "Werkschema",
              "en": "Work agenda"
            },
            "watcher_desc":{
              "fr": "Calendrier d'équipe",
              "nl": "Ploeg kalender",
              "en": "Team calendar"
            },
            "nexus_desc":{
              "fr": "Personnes disponibles",
              "nl": "Beschikbare personen",
              "en": "Available people"
            },
            "access_manager_tooltip":{
              "fr": "Gestion de l'équipe",
              "nl": "Team management",
              "en": "Team management"
            },
            "access_manager_edit":{
              "fr": "Éditer les informations de",
              "nl": "Bewerk informatie van",
              "en": "Editing information"
            },
            "access_grades":{
              
            },
            "access_reset_password":{
              "fr": "Envoyer un nouveau mot de passe",
              "nl": "Stuur een nieuw wachtwoord",
              "en": "Send a new password"
            },
            "access_is_manager":{
              "fr": "Est manager de l'équipe",
              "nl": "Teammanager",
              "en": "Is team manager"
            },
            "access_is_manager_hint":{
              "fr": "Peut ajouter des membres à l'équipe et modifier leurs accès.",
              "nl": "Kan leden toevoegen aan het team en hun toegang veranderen.",
              "en": "Can add members to the team and change their access."
            },
            "access_draft_title":{
              "fr": "Paramètres liés à Draft",
              "nl": "Draft instellingen",
              "en": "Draft settings"
            },
            "access_draft_is_editor":{
              "fr": "Est éditeur",
              "nl": "Editor",
              "en": "Is editor"
            },
            "access_draft_is_editor_hint":{
              "fr": "Peut créer, modifier et supprimer les projets et les tâches.",
              "nl": "Kan creëren, aanpassen en projecten en taken wissen.",
              "en": "Can create, modify and delete projects and tasks."
            },
            "access_draft_is_user":{
              "fr": "Est utilisateur",
              "nl": "Is gebruiker",
              "en": "Is user"
            },
            "access_draft_is_user_hint":{
              "fr": "Peut changer le statut des tâches et des sous-tâches.",
              "nl": "Kan de status van taken en subtaken veranderen.",
              "en": "May change the status of tasks and sub-tasks."
            },
            "access_draft_can_see_private":{
              "fr": "Peut voir les projets privés",
              "nl": "Kan privéprojecten zien",
              "en": "Can see private projects"
            },
            "access_draft_can_see_private_hint":{
              "fr": "Peut voir les projets privés",
              "nl": "Kan privéprojecten zien",
              "en": "Can see private projects",
            },
            "access_planner_title":{
              "fr": "Paramètres liés à Planner",
              "nl": "Planner parameters",
              "en": "Planner settings"
            },
            "access_planner_is_editor":{
              "fr": "Est éditeur",
              "nl": "Editor",
              "en": "Is editor"
            },
            "access_planner_is_editor_hint":{
              "fr": "Peut créer, planifier, modifier et supprimer les tâches.",
              "nl": "Kan creëren, plannen, aanpassen en taken verwijderen.",
              "en": "Can create, plan, modify and delete tasks."
            },
            "access_planner_is_user":{
              "fr": "Est utilisateur",
              "nl": "Is gebruiker",
              "en": "Is user"
            },
            "access_planner_is_user_hint":{
              "fr": "Peut changer le statut des tâches et des sous-tâches.",
              "nl": "Kan de status van taken en subtaken veranderen.",
              "en": "May change the status of tasks and sub-tasks."
            },
            "access_radium_title":{
              "fr": "Paramètres liés à Radium",
              "nl": "Radium gerelateerde parameters",
              "en": "Radium-related parameters"
            },
            "access_radium_is_editor":{
              "fr": "Est éditeur",
              "nl": "Is editor",
              "en": "Is editor"
            },
            "access_radium_is_editor_hint":{
              "fr": "Peut créer, modifier et supprimer les chantiers.",
              "nl": "Kan creëren, aanpassen en verwijderen van werkzaamheden.",
              "en": "Can create, modify and delete the works."
            },
            "access_watcher_title":{
              "fr": "Paramètres liés à Watcher",
              "nl": "Watcher instellingen",
              "en": "Watcher settings"
            },
            "access_watcher_is_editor":{
              "fr": "Est éditeur",
              "nl": "Is editor",
              "en": "Is editor"
            },
            "access_watcher_is_editor_hint":{
              "fr": "Peut modifier les cellules, planifier le travail, modifier les éléments (tâches, fichiers, ...).",
              "nl": "Kan de cellen aanpassen, het werk plannen, de elementen aanpassen, bestanden...",
              "en": "Can modify the cells, plan the work, modify the elements (sheets, files, ...)."
            },
            "access_watcher_is_user":{
              "fr": "Est utilisateur",
              "nl": "Is gebruiker",
              "en": "Is user"
            },
            "access_watcher_is_user_hint":{
              "fr": "Peut changer le statut des tâches et des sous-tâches.",
              "nl": "Kan de status van taken en subtaken veranderen.",
              "en": "May change the status of tasks and sub-tasks."
            },
            "access_watcher_is_visible":{
              "fr": "Est visible",
              "nl": "Is zichtbaar",
              "en": "Is visible"
            },
            "access_watcher_is_visible_hint":{
              "fr": "Apparaît dans le calendrier.",
              "nl": "verschijnt in de kalender.",
              "en": "Appears in the calendar."
            },
            "access_watcher_is_printable":{
              "fr": "Est imprimable",
              "nl": "Afdrukbaar",
              "en": "Printable"
            },
            "access_watcher_is_printable_hint":{
              "fr": "Apparaît dans le calendrier imprimable.",
              "nl": "Verschijnt op de afdrukbare kalender.",
              "en": "Appears in the printable calendar."
            },
            "access_watcher_can_see_cells":{
              "fr": "Peut voir toutes les cellules",
              "nl": "Kan alle cellen zien",
              "en": "Can see all the cells"
            },
            "access_watcher_can_see_cells_hint":{
              "fr": "Également les cellules des autres agents.",
              "nl": "Ook de cellen van andere bedienden.",
              "en": "Also the cells of other agents."
            },
            "access_watcher_can_see_quotas":{
              "fr": "Peut voir tous les congés",
              "nl": "Mag alle verlof zien",
              "en": "Can see all leave"
            },
            "access_watcher_can_see_quotas_hint":{
              "fr": "Également les congés des autres agents.",
              "nl": "Eveneens het verlof van andere bedienden.",
              "en": "Also leave of other officers."
            },
            "access_can_see_calendars":{
              "fr": "Peut voir tous les calendriers",
              "nl": "Kan alle agenda's zien",
              "en": "Can see all calendars"
            },
            "access_can_see_calendars_hint":{
              "fr": "Également le calendrier des autres équipes.",
              "nl": "Ook de agenda van andere ploegen.",
              "en": "Also the calendar of other teams."
            },
            "access_password_dialog_title":{
              "fr": "Êtes-vous sûr de vouloir envoyer un nouveau mot de passe à cet utilisateur ?",
              "nl": "Weet je zeker dat je een nieuw wachtwoord naar deze gebruiker wilt sturen?",
              "en": "Are you sure you want to send a new password to this user?"
            },
            "access_password_dialog_warning":{
              "fr": "Attention, cela réinitialisera le mot de passe actuel de l'utilisateur et il ne pourra se connecter qu'avec le nouveau mot de passe qui lui sera envoyé par email.",
              "nl": "Attentie, dit zal het huidige wachtwoord van de gebruiker herinstellen en zich alleen kunnen verbinden met het nieuwe wachtwoord dat zal worden opgestuurd per e-mail.",
              "en": "Attention, this will reset the user's current password and it will only be able to connect with the new password that will be sent to it by email."
            },
            "access_delete_dialog_title":{
              "fr": "Êtes-vous sûr de vouloir retirer tous les accès de cet utilisateur ?",
              "nl": "Weet je zeker dat je alle toegangen van deze gebruiker wilt verwijderen?",
              "en": "Are you sure you want to remove all access from this user?"
            },
            "access_delete_dialog_warning":{
              "fr": "Le compte utilisateur ne sera pas supprimé d'Apex mais uniquement ses accès à cette équipe.",
              "nl": "het gebruikersprofiel zal niet worden verwijderd van Apex maar alleen zijn toegang tot dit team.",
              "en": "The user account will not be deleted from apex but only its access to this team."
            },
            "access_remove_access":{
              "fr": "Retirer les accès",
              "nl": "Verwijder toegangen",
              "en": "Remove access"
            },
            "access_create_user":{
              "fr": "Créer un nouvel utilisateur",
              "nl": "Een nieuwe gebruiker maken",
              "en": "Create a new user"
            },
            "access_add_existing_user":{
              "fr": "Ajouter un utilisateur existant",
              "nl": "Voeg een bestaande gebruiker toe",
              "en": "Add an existing user"
            },
            "access_confirm_create_user":{
              "fr": "Créer un nouvel utilisateur",
              "nl": "Een nieuwe gebruiker maken",
              "en": "Create a new user"
            },
            "access_confirm_create_user_info":{
              "fr": "Êtes-vous sûr de vouloir créer un nouvel utilisateur ?\nVous ne pourrez pas le supprimer.",
              "nl": "Weet je zeker dat je een nieuwe gebruiker wilt maken?\nJe kunt het niet verwijderen.",
              "en": "Are you sure you want to create a new user?\nYou can't delete it."
            },
            "access_confirm_create_user_send_password":{
              "fr": "Envoyer un mot de passe ?",
              "nl": "Een wachtwoord sturen ?",
              "en": "Send a password ?"
            },
            "access_confirm_create_user_send_password_hint":{
              "fr": "L'utilisateur recevera un mot de passe par email et pourra se connecter à Apex.",
              "nl": "De gebruiker krijgt een wachtwoord per e-mail en zal kunnen inloggen op Apex.",
              "en": "The user will receive a password by email and can log in to apex."
            },
            "access_info_profile_exists":{
              "fr": "Un ou plusieurs profil avec le même nom ont été trouvés. Êtes-vous sûr(e) qu'il ne s'agit pas d'un des ces utilisateurs:",
              "nl": "Één of meer profielen met dezelfde naam werden gevonden. Weet je zeker dat dit niet één van deze gebruikers is?",
              "en": "One or more profiles with the same name were found. Are you sure that this is not one of these users:"
            },
            "access_warning_user_exists":{
              "fr": "Avant de créer un nouvel utilisateur, assurez-vous qu'il n'existe pas. Sinon, utilisez le champ \"Ajouter un utilisateur exisitant\".",
              "nl": "Voordat je een nieuwe gebruiker maakt, zorg ervoor dat hij niet bestaat. Gebruik anders het \"Voeg een bestaande gebruiker toe\" veld.",
              "en": "Before creating a new user, make sure it doesn't exist. otherwise use the \"add an exisiting user\" field."
            },
            "access_give_all_access":{
              "fr": "Donner tous les accès",
              "nl": "Geef alle toegangen",
              "en": "Give all access"
            },
            "access_remove_all_access":{
              "fr": "Retirer tous les accès",
              "nl": "Verwijder alle toegangen",
              "en": "Remove all access"
            },
            "send_password_success":{
              "fr": "Un email contenant un nouveau mot de passe a été envoyé avec succès.",
              "nl": "Een e-mail met een nieuw wachtwoord is succesvol verzonden.",
              "en": "An email containing a new password has been sent successfully."
            },
            "send_password_error":{
              "fr": "Une erreur est survenue lors de l'envoi de l'email.",
              "nl": "Er is een fout opgetreden tijdens het verzenden van de e-mail.",
              "en": "An error occurred while sending the email."
            },
          },




          "myapex":{
            "my_applications":{
              "fr": "Mes applications",
              "nl": "Mijn toepassingen",
              "en": "My applications"
            },
            "not_installed_apps":{
              "fr": "Applications pas encore installées",
              "nl": "Toepassingen nog niet geïnstalleerd",
              "en": "Applications not yet installed"
            },
            "install_apps":{
              "fr": "Installer des applications",
              "nl": "Installatie toepassingen aanvragen",
              "en": "Install applications"
            }
          },




          "nexus":{
            "select_date":{
              "fr": "Sélectionner une date",
              "nl": "Kies een datum",
              "en": "Select a date"
            },
            "add_new_contact":{
              "fr": "Ajouter un nouveau contact",
              "nl": "Voeg een nieuw contact toe.",
              "en": "Add a new contact"
            }
          },




          "watcher":{
            "calendar_detail_title":{
              "fr": "Informations supplémentaires",
              "nl": "Extra informatie",
              "en": "Additional information"
            },
            "calendar_detail_subtitle_day":{
              "fr": "Pour le @@@",
              "nl": "Voor @@@",
              "en": "For @@@"
            },
            "calendar_detail_subtitle_cell":{
              "fr": "Pour ### le @@@",
              "nl": "Voor ## op @@@",
              "en": "For ## the @@@"
            },
            "calendar_detail_short":{
              "fr": "Texte court",
              "nl": "Korte tekst",
              "en": "Text court"
            },
            "calendar_detail_short_hint":{
              "fr": "Ce texte sera affiché dans la troisième case de la cellule.",
              "nl": "Deze tekst zal worden vertoond in het derde vakje van de cel.",
              "en": "This text will be displayed in the third box of the cell."
            },
            "calendar_detail_no_element":{
              "fr": "Pas encore d'élément dans cette journée.",
              "nl": "Nog geen elementen op deze dag.",
              "en": "Not yet any element in this day."
            },
            "calendar_add_element_tooltip":{
              "fr": "Ajouter un élément",
              "nl": "Voeg een element toe",
              "en": "Add an element"
            },
            "calendar_edit_elements_tooltip":{
              "fr": "Éditer les éléments",
              "nl": "Bewerk de elementen",
              "en": "Editing elements"
            },
            "calendar_add_call":{
              "fr": "Ajouter une intervention",
              "nl": "Voeg een interventie toe",
              "en": "Add an intervention"
            },
            "calendar_add_note":{
              "fr": "Ajouter une note",
              "nl": "Voeg een notitie toe",
              "en": "Add a note"
            },
            "calendar_add_file":{
              "fr": "Ajouter un fichier",
              "nl": "Voeg een dossier toe",
              "en": "Add a file"
            },
            "calendar_show_all_quotas":{
              "fr": "Afficher tous les quotas",
              "nl": "Alle quota weergeven",
              "en": "Display all quotas"
            },
            "calendar_no_profile":{
              "fr": "Il n'y a personne dans ce calendrier ou vous n'avez pas les accès pour visualiser cette équipe.",
              "nl": "Er staat niemand in deze agenda of je hebt geen toegang om dit team te bekijken.",
              "en": "There is no one in this calendar or you do not have the access to view this team."
            },
            "quota_no_access":{
              "fr": "Vous n'avez pas les accès pour visualiser les quotas de cette personne.",
              "nl": "U heeft geen toegang om de quota van deze persoon te bekijken.",
              "en": "You do not have the access to view this person's quotas."
            },
            "paint_border":{
              "fr": "Colorer les bordures de cellules",
              "nl": "Verkleur de cellen",
              "en": "Color the cell borders"
            },
            "paint_cell":{
              "fr": "Colorer l'intérieur des cellules",
              "nl": "Kleur binenste van de cellen",
              "en": "Color inside the cells"
            },
            "paint_profile_border":{
              "fr": "Colorer le bord des membres de l'équipe",
              "nl": "Kleur de rand van de teamleden",
              "en": "Color the border of the team members"
            },
            "call_name":{
              "fr": "Description du dérangement",
              "nl": "Beschrijving van de storing",
              "en": "Description of the disturbance"
            },
            "call_kind":{
              "fr": "Type d'intervention",
              "nl": "Soort interventie",
              "en": "Type of intervention"
            },
            "call_description":{
              "fr": "Description de l'intervention",
              "nl": "Beschrijving van de interventie",
              "en": "Description of the intervention"
            },
            "call_send_d27":{
              "fr": "Envoyer un D27",
              "nl": "Stuur een D27",
              "en": "Send a D27"
            },
            "call_replace_d27":{
              "fr": "Remplacer le D27 existant",
              "nl": "Vervang D27",
              "en": "Replace existing D27"
            },
            "call_add_link_d27":{
              "fr": "Ajouter un lien vers un D27",
              "nl": "Voeg een link toe aan een D27",
              "en": "Add a link to a D27"
            },
            "call_replace_link_d27":{
              "fr": "Remplacer le lien du D27",
              "nl": "Vervang de D27 link",
              "en": "Replace the D27 link"
            },
            "call_from_to":{
              "fr": "de @@@ à ###",
              "nl": "voor @@@ op ###",
              "en": "de @@@ to ###",
            },
            "call_download_d27":{
              "fr": "Télécharger le D27",
              "nl": "Download de D27",
              "en": "Download the D27"
            },
            "call_delete_existing_d27":{
              "fr": "Supprimer le D27 existant",
              "nl": "Verwijder bestaande D27",
              "en": "Delete existing D27"
            },
            "call_delete_link_d27":{
              "fr": "Supprimer le lien vers le D27",
              "nl": "Verwijder de link naar de D27",
              "en": "Delete the link to the D27"
            },
            "call_link_url":{
              "fr": "URL vers le D27",
              "nl": "URL naar de D27",
              "en": "URL to the D27"
            },
            "calls_summary":{
              "fr": "Récapitulatif des interventions",
              "nl": "Samenvatting van interventies",
              "en": "Summary of interventions"
            },
            "palette_cells":{
              "fr": "Colorer les cellules",
              "nl": "Kleur de cellen",
              "en": "Coloring cells"
            },
            "hour_calculator":{
              "fr": "Convertisseur heure/décimale",
              "nl": "Decimale converter",
              "en": "Hour/decimal converter"
            },
            "printable_calendar":{
              "fr": "Calendrier imprimable",
              "nl": "Afdrukbare kalender",
              "en": "Printable calendar"
            },
            "leaves_management":{
              "fr": "Gestion des congés",
              "nl": "Verlof beheren",
              "en": "Leave management"
            },
            "leaves_config":{
              "fr": "Configuration des congés",
              "nl": "Verlof instellingen",
              "en": "Leave configuration"
            },
            "leaves_no_leave_set_1":{
              "fr": "Il n'y a pas encore de types de congé configurés pour cette équipe.",
              "nl": "Er zijn nog geen soorten verlof voor dit team ingesteld.",
              "en": "There are no types of leave set for this team yet."
            },
            "leaves_no_leave_set_2":{
              "fr": "Pour en ajouter, cliquez sur le bouton turquoise en haut de page.",
              "nl": "Om het toe te voegen, klik de turquoise knop aan de bovenkant van de pagina.",
              "en": "To add it, click the turquoise button at the top of the page."
            },
            "leaves_leave_name":{
              "fr": "Nom du congé",
              "nl": "Naam van het verlof",
              "en": "Leave name"
            },
            "leaves_leave_desc":{
              "fr": "Déscription du congé",
              "nl": "Beschrijving van het verlof",
              "en": "Leave description"
            },
            "leaves_leave_color":{
              "fr": "Couleur du congé",
              "nl": "Kleur van het verlof",
              "en": "Leave color"
            },
            "leaves_leave_type":{
              "fr": "Type de congé",
              "nl": "Soort verlof",
              "en": "Type of leave"
            },
            "leaves_leave_count":{
              "fr": "Nombre de types de congés",
              "nl": "Aantal soorten verlof",
              "en": "Number of types of leave"
            },
            "leaves_remove_leave_type":{
              "fr": "Retirer un type de congé",
              "nl": "Een soort verlof verwijderen",
              "en": "Withdraw a type of leave"
            },
            "leaves_remove_leave_type_warning":{
              "fr": "Attention, si vous supprimez ce type de congé, vous supprimerez églamenent les quotas associés des membres de l'équipe.",
              "nl": "Attentie, als je dit soort verlof verwijdert, verwijder je de geassocieerde quotas van de teamleden.",
              "en": "Attention, if you delete this type of leave, you will remove the associated quotas from team members."
            },
            "leaves_add_leave_type":{
              "fr": "Ajouter un type de congé",
              "nl": "Voeg een soort verlof toe",
              "en": "Add a type of leave"
            },
            "leaves_set_leave_config":{
              "fr": "Définir une configuration",
              "nl": "Definieer een configuratie",
              "en": "Define a configuration"
            },
            "leaves_set_leave_config_alert":{
              "fr": "Attention, définir une configuration supprimera définitivement votre configuration actuelle avant d'ajouter la nouvelle.",
              "nl": "Wees voorzichtig, het definiëren van een configuratie zal uw huidige configuratie permanent verwijderen voordat u de nieuwe toevoegt.",
              "en": "Be careful, defining a configuration will permanently delete your current configuration before adding the new one."
            },
            "leaves_leave_config_french_default":{
              "fr": "Configuration francaise (défault)",
              "nl": "Franse configuratie (standaard)",
              "en": "French configuration (default)"
            },
            "leaves_leave_config_dutch_default":{
              "fr": "Configuration néérlandaise (défault)",
              "nl": "Nederlandse configuratie (standaard)",
              "en": "Dutch configuration (default)"
            },
            "leaves_leave_config_empty_config":{
              "fr": "Aucune (supprimera la configuration actuelle)",
              "nl": "Geen (verwijdert de huidige configuratie)",
              "en": "None (will delete current configuration)"
            },
            "calls_title":{
              "fr": "Récapitulatif des interventions",
              "nl": "Samenvatting van interventies",
              "en": "Summary of interventions"
            },
            "calls_worker":{
              "fr": "Agent",
              "nl": "Agent",
              "en": "Agent"
            },
            "calls_kind":{
              "fr": "Type",
              "nl": "Type",
              "en": "Type"
            },
            "calls_d27":{
              "fr": "D27",
              "nl": "D27",
              "en": "D27"
            },
            "calls_with_d27":{
              "fr": "Avec D27",
              "nl": "Met D27",
              "en": "With D27"
            },
            "calls_no_call":{
              "fr": "Pas d'intervention",
              "nl": "Geen interventie",
              "en": "No intervention"
            },
            "quota_base_quota":{
              "fr": "Droit de base",
              "nl": "Basisrecht",
              "en": "Basic right"
            },
            "quota_took":{
              "fr": "Pris",
              "nl": "Genomen",
              "en": "Taken"
            },
            "quota_obtained":{
              "fr": "Obtenu",
              "nl": "Gekregen",
              "en": "Obtained"
            },
            "quota_left":{
              "fr": "Reste",
              "nl": "Overschot",
              "en": "Remains"
            },
            "quota_add_leave_type":{
              "fr": "Pour en ajouter, naviguez vers le menu « Gestion des congés ».",
              "nl": "Om toe te voegen, navigeert u naar het menu « Verlofbeheer ».",
              "en": "To add more, navigate to the « Leave Management » menu."
            },
          },



          "radium":{
            "palette_works_tooltip":{
              "fr": "Colorer les chantier",
              "nl": "De werf kleuren",
              "en": "Color works"
            },
            "filter_works_tooltip":{
              "fr": "Filtrer les chantiers",
              "nl": "De werven filteren",
              "en": "Filter works"
            },
            "sort_works_tooltip":{
              "fr": "Trier les chantiers",
              "nl": "Werven sorteren",
              "en": "Sort works"
            },
            "sort_works_by_placeholder":{
              "fr": "Trier les chantiers par",
              "nl": "Sorteer werven op",
              "en": "Sort works by"
            },
            "original_order":{
              "fr": "Ordre original",
              "nl": "Oospronkele order",
              "en": "Original order"
            },
            "sort_works_by_increasing_day_tooltip":{
              "fr": "Trier les chantiers par jour croissant",
              "nl": "Sorteer werven door kruisende dagen",
              "en": "Sort works by increasing day"
            },
            "printable_tooltip":{
              "fr": "Liste imprimable des chantiers du mois",
              "nl": "Afdrukbare lijst met werken van deze maand",
              "en": "Printable list of works of this month"
            },
            "customize_tooltip":{
              "fr": "Personnaliser Radium",
              "nl": "Personaliseer raduim",
              "en": "Customize Radium"
            },
            "add_work_tooltip":{
              "fr": "Ajouter un chantier",
              "nl": "Werk toevoegen",
              "en": "Add work"
            },
            "show_messages_tooltip":{
              "fr": "Afficher les messages",
              "nl": "Berichten weergeven",
              "en": "Show messages"
            },
            "message_priority":{
              "fr": "Priorité du message",
              "nl": "Prioriteit van het breicht",
              "en": "Message priority"
            },
            "column_title_shifts":{
              "fr": "Prestations",
              "nl": "Prestaties",
              "en": "Shifts"
            },
            "column_title_dates":{
              "fr": "Dates",
              "nl": "Datum",
              "en": "Dates"
            },
            "column_title_schedules":{
              "fr": "Horaires",
              "nl": "Schema's",
              "en": "Schedules"
            },
            "column_title_description":{
              "fr": "Description",
              "nl": "Beschrijving",
              "en": "Description"
            },
            "column_title_note":{
              "fr": "Remarques",
              "nl": "Opmerking",
              "en": "Note"
            },
            "column_title_ilt":{
              "fr": "ILT",
              "nl": "TPO",
              "en": "???"
            },
            "column_title_files":{
              "fr": "Fichiers",
              "nl": "Bestanden",
              "en": "Files"
            },
            "column_title_ilts":{
              "fr": "ILT",
              "nl": "TPO",
              "en": "???"
            },
            "column_title_bnxs":{
              "fr": "BNX",
              "nl": "BNX",
              "en": "BNX?"
            },
            "column_title_fmhts":{
              "fr": "FMHT",
              "nl": "FMHT?",
              "en": "FMHT?"
            },
            "column_title_others":{
              "fr": "Divers",
              "nl": "Anderen",
              "en": "Others"
            },
            "column_title_upm":{
              "fr": "UPM",
              "nl": "UPM",
              "en": "UPM"
            },
            "column_title_colt":{
              "fr": "CoLT",
              "nl": "CoLT",
              "en": "CoLT"
            },
            "column_title_status":{
              "fr": "Statut",
              "nl": "Status",
              "en": "Status"
            },
            "column_title_limits":{
              "fr": "Limites de mise hors service",
              "nl": "Begrenzingen",
              "en": "Limits"
            },
            "column_title_s460s":{
              "fr": "S460",
              "nl": "S460",
              "en": "S460"
            },
            "column_title_zkl":{
              "fr": "ZKL",
              "nl": "ZKL",
              "en": "ZKL"
            },
            "column_title_cascat":{
              "fr": "Cas caténaire",
              "nl": "Bovenleidingsgevallen",
              "en": "CC?"
            },
            "column_title_grue":{
              "fr": "Grue RR",
              "nl": "Wegspoorkraan",
              "en": "Backhoe"
            },
            "column_title_osv":{
              "fr": "OSV",
              "nl": "OSV",
              "en": "OSV"
            },
            "column_title_loco":{
              "fr": "Loco",
              "nl": "Loco",
              "en": "Loco"
            },
            "column_title_hgs":{
              "fr": "HGS",
              "nl": "HGS",
              "en": "HGS"
            },
            "column_title_soudure":{
              "fr": "Soudure",
              "nl": "Lassen",
              "en": "Welding"
            },
            "column_title_pn":{
              "fr": "PN",
              "nl": "OW",
              "en": "RC"
            },
            "column_title_art":{
              "fr": "ART",
              "nl": "ART?",
              "en": "ART?"
            },
            "column_title_s428":{
              "fr": "S428",
              "nl": "S428",
              "en": "S428"
            },
            "column_title_s461":{
              "fr": "S461",
              "nl": "S461",
              "en": "S461"
            },
            "column_title_atwtx":{
              "fr": "ATW-Tx",
              "nl": "ATW-Tx",
              "en": "ATW-Tx"
            },
            "column_title_imputation":{
              "fr": "Imputation",
              "nl": "Imputatie",
              "en": "Imputation"
            },
            "column_title_extra":{
              "fr": "Divers",
              "nl": "Diversen",
              "en": "Extra"
            },
            "column_title_supervisor":{
              "fr": "Responsable",
              "nl": "Verantwoordelijke",
              "en": "Supervisor"
            },
            "column_title_line":{
              "fr": "Ligne",
              "nl": "Lijn",
              "en": "Line"
            },
            "edit_tooltip":{
              "fr": "Déverrouiller et modifier ce chantier",
              "nl": "Ontgrendel en bewerk deze werf.",
              "en": "Unlock and edit this work"
            },
            "lock_tooltip":{
              "fr": "Verrouiller ce chantier",
              "nl": "Vergrendel deze werf",
              "en": "Lock this work"
            },
            "delete_tooltip":{
              "fr": "Supprimer ce chantier",
              "nl": "Verwijder dit werf.",
              "en": "Delete this work"
            },
            "message_tooltip":{
              "fr": "Envoyer un message concernant ce chantier",
              "nl": "Stuur een bericht over deze werf.",
              "en": "Send a message about this work"
            },
            "copy_tooltip":{
              "fr": "Créer une copie de ce chantier ici ou dans un autre mois",
              "nl": "Creëer een kopie van deze werf hier of in een andere maand",
              "en": "Create a copy of this work here or in another month"
            },
            "move_tooltip":{
              "fr": "Déplacer ce chantier dans un autre mois",
              "nl": "Verplaats deze werf in een andere maand",
              "en": "Move this work to another month"
            },
            "link_radiums_tooltip":{
              "fr": "Lier ce chantier à d'autres Radium",
              "nl": "Verbind deze werf met andere radiums",
              "en": "Link this work to other Radium"
            },
            "link_radiums_snackbar":{
              "fr": "Ce chantier à bien été liés aux Radium sélectionnés.",
              "nl": "Deze werf is gelinkt aan het geselecteerde radium.",
              "en": "This work has been successfully linked to selected Radium."
            },
            "link_teams_tooltip":{
              "fr": "Ajouter des équipes à cette prestation",
              "nl": "Voeg teams toe aan deze prestatie",
              "en": "Add teams to this shift"
            },
            "participating_teams":{
              "fr": "Equipes participantes au chantier",
              "nl": "Teams die deelnemen aan de werf",
              "en": "Teams participating in the work"
            },
            "part_set_available":{
              "fr": "Je suis disponible",
              "nl": "Ik ben beschikbaar",
              "en": "I'm available"
            },
            "part_set_unavailable":{
              "fr": "Je ne suis pas disponible",
              "nl": "Ik ben niet beschikbaar",
              "en": "I am not available"
            },
            "part_needs":{
              "fr": "Besoin de",
              "nl": "Benodigheden",
              "en": "Need"
            },
            "participating_profiles":{
              "fr": "Agents participants",
              "nl": "Deelnemende bedienden",
              "en": "Participating people"
            },
            "no_participating_teams":{
              "fr": "Aucune équipe ne participe à cette prestation.",
              "nl": "Geen enkele ploeg zal deelnemen tijdensdeze prestatie.",
              "en": "No team participates in this shift."
            },
            "no_shift":{
              "fr": "Pas encore de prestation pour ce chantier.",
              "nl": "Nog geen prestatie voor deze werf.",
              "en": "No shift for this work yet."
            },
            "no_shift_date":{
              "fr": "Veuillez introduire une date à cette prestation pour ajouter une équipe.",
              "nl": "Geef een datum aan deze prestatie om een ploeg toe te voegen.",
              "en": "Please enter a date for this shift to add a team."
            },
            "remove_project":{
              "fr": "Supprimer le lien vers le projet Draft",
              "nl": "Verwijder de link naar het ontwerp",
              "en": "Remove the link to the Draft project"
            },
            "remove_part":{
              "fr": "Supprimer la participation de l'équipe",
              "nl": "Verwijder ploeg deelname",
              "en": "Send a message to team members"
            },
            "send_team_message":{
              "fr": "Envoyer un message aux membres de l'équipe",
              "nl": "Stuur een bericht naar ploegleden",
              "en": "Send a message to team members"
            },
            "lock_part":{
              "fr": "Verrouiller la participation",
              "nl": "Vergrendel de deelname",
              "en": "Lock participation"
            },
            "unlock_part":{
              "fr": "Déverrouiller la participation",
              "nl": "De deelname ontgrendelen",
              "en": "Unlock participation"
            },
            "locked_part":{
              "fr": "Cette participation est verrouillée.",
              "nl": "Deze deelname is vergrendeld.",
              "en": "This participation is locked."
            },
            "short_override":{
              "fr": "Écraser la troisième case des cellules Watcher",
              "nl": "Verpletter het derde vak in wachter",
              "en": "Overwrite the third cells box"
            },
            "part_description":{
              "fr": "Description du travail pour cette équipe",
              "nl": "Jobomschrijving voor dit team",
              "en": "Work description for this team"
            },
            "short_override_confirm":{
              "fr": "La troisième case des cellules des participants ont bien été écrasées dans le calendrier Watcher.",
              "nl": "De derde vakje van de deelnemers is verpletterd in de wachter kalender.",
              "en": "The third box of the participants' cells has been overwritten in the Watcher calendar."
            },
            "log_title":{
              "fr": "Historique des modifications de la colonne",
              "nl": "Geschiedenis van kolomwijziging",
              "en": "History of columns updates"
            },
            "log_no_log":{
              "fr": "Pas de modification pour cette cellule.",
              "nl": "Geen verandering in die cel.",
              "en": "No update for this cell."
            },
            "no_works":{
              "fr": "Il n'y a pas encore de chantier ce mois.",
              "nl": "Er is nog geen werf deze maand.",
              "en": "There is no work yet this month."
            },
            "no_filters_result":{
              "fr": "Il n'y a pas de chantier correspondant aux filtres appliqués.",
              "nl": "Er is geen werf die overeenkomt met de toegepaste filters.",
              "en": "There is no work corresponding to the filters applied."
            },
            "message_to_linked_radiums":{
              "fr": "Envoyer ce message aux Radium liés :",
              "nl": "Stuur deze boodschap naar gerelateerde radium:",
              "en": "Send this message to linked Radium :"
            },
            "message_presets":{
              "fr": "Messages prédéfinis",
              "nl": "Voorafgaande berichten",
              "en": "Preset messages"
            },
            "message_preset_work_added":{
              "fr": "Un nouveau chantier a été ajouté.",
              "nl": "Een nieuw project werd toegevoegd.",
              "en": "A new work has been added."
            },
            "message_preset_date_updated":{
              "fr": "La date du chantier a été modifiée.",
              "nl": "De werfdatum is aangepast.",
              "en": "The work's date has been updated."
            },
            "message_preset_shift_updated":{
              "fr": "La prestation du chantier à été modifiée.",
              "nl": "De prestatie van de werf is aangepast.",
              "en": "The work's shift has been updated."
            },
            "message_preset_desc_updated":{
              "fr": "La description du chantier a été mise à jour.",
              "nl": "De werfbeschrijving is up to date.",
              "en": "The work's description has been updated."
            },
            "message_preset_note_added":{
              "fr": "Une remarque a été ajoutée.",
              "nl": "Een opmerking is toegevoegd.",
              "en": "A note has been added."
            },
            "message_preset_bnx_added":{
              "fr": "Un nouveau BNX a été publié.",
              "nl": "Een nieuwe BNX werd gepubliceerd.",
              "en": "A new ??? has been published."
            },
            "message_preset_ilt_added":{
              "fr": "Une nouvelle ILT a été publiée.",
              "nl": "Een nieuwe TPO werd gepubliceerd.",
              "en": "A new ??? has been published."
            },
            "message_preset_work_canceled":{
              "fr": "Le chantier est annulé.",
              "nl": "De werf is afgeschaft.",
              "en": "The work is canceled."
            },
            "messages_dialog_title":{
              "fr": "Messages concernant les chantiers de ce Radium",
              "nl": "Berichten over de werf van dit radium",
              "en": "Radium's works' messages"
            },
            "messages_work_date":{
              "fr": "Chantier du",
              "nl": "Werf van",
              "en": "Work of"
            },
            "messages_no_message":{
              "fr": "Pas de message pour le moment.",
              "nl": "Geen bericht op dit moment.",
              "en": "No message yet"
            },
            "paint_works":{
              "fr": "Colorer les chantiers",
              "nl": "Kleur de werf",
              "en": "Color works"
            },
            "paint_columns_bg":{
              "fr": "Colorer la couleur de fond des colonnes",
              "nl": "Achtergrond van de kolommen kleuren",
              "en": "Color columns background"
            },
            "paint_columns_text":{
              "fr": "Colorer le texte des colonnes",
              "nl": "De tekst van de Kolommen kleuren",
              "en": "Color columns text"
            },
            "paint_rows_bg":{
              "fr": "Colorer la couleur de fond des lignes",
              "nl": "De achtergrondlijnen kleuren",
              "en": "Color row background"
            },
            "paint_rows_text":{
              "fr": "Colorer le texte des lignes",
              "nl": "De tekst van de lijnen kleuren",
              "en": "Color row text"
            },
            "line":{
              "fr": "Ligne",
              "nl": "Lijn",
              "en": "Line"
            },
            "station":{
              "fr": "Gare",
              "nl": "Station",
              "en": "Station"
            },
            "lane":{
              "fr": "Voie",
              "nl": "Sporen",
              "en": "Lane"
            },
            "signal":{
              "fr": "Signal",
              "nl": "Sein",
              "en": "Signal"
            },
            "pk":{
              "fr": "PK",
              "nl": "KP",
              "en": "PK"
            },
            "from":{
              "fr": "De",
              "nl": "Van",
              "en": "From"
            },
            "to":{
              "fr": "À",
              "nl": "Naar",
              "en": "To"
            },
            "printable_works":{
              "fr": "Chantiers",
              "nl": "Werven",
              "en": "Works"
            }
          },




          "planner":{
            "to_be_planned":{
              "fr": "A planifier",
              "nl": "Te plannen",
              "en": "To be planned"
            },
            "planned":{
              "fr": "Planifié",
              "nl": "Gepland",
              "en": "Planned"
            },
            "printable_board":{
              "fr": "Version imprimable du planning",
              "nl": "Afdrukbare versie van het planning",
              "en": "Printable version of the schedule"
            },
            "edit_teammates":{
              "fr": "Modifier les agents participants",
              "nl": "Bewerk deelnemende bedienden",
              "en": "Edit participating people"
            },
            "add_foreign_user":{
              "fr": "Ajouter un membre d'une autre équipe",
              "nl": "Voeg een lid van een ander ploeg toe",
              "en": "Add a member of another team"
            },
            "planning":{
              "fr": "Planning",
              "nl": "Planning",
              "en": "Schedule"
            },
            "folders_setting":{
              "fr": "Gestion des dossiers",
              "nl": "Beheer van de gegevens",
              "en": "Forlers setting"
            },
            "folder_name":{
              "fr": "Nom du dossier",
              "nl": "Naam van het dossier",
              "en": "Folder name"
            },
            "folder_max_six":{
              "fr": "Maximum 6 dossiers",
              "nl": "Maximaal 6 mappen",
              "en": "Maximum 6 folders"
            },
            "add_folder":{
              "fr": "Ajouter un dossier",
              "nl": "Voeg een dossier toe",
              "en": "Add folder"
            },
            "delete_folder":{
              "fr": "Supprimer ce dossier",
              "nl": "Verwijder dit dossier",
              "en": "Delete folder"
            },
            "delete_folder_warning":{
              "fr": "Attention, il existe des éléments dans ce dossier. Si vous le supprimez, tous les éléments de ce dossier seront également supprimés.",
              "nl": "Attentie, er zijn elementen in dit dossier. Als je het verwijdert, worden alle elementen van deze map ook verwijderd.",
              "en": "Please note that there are elements in this folder. If you delete it, all elements in that folder will also be deleted."
            },
            "board_copy_tip":{
              "fr": "Maintenez la touche Ctrl avant de déplacer les élements pour les copier",
              "nl": "Houd de Ctrl-toets ingedrukt voordat u elementen verplaatst om ze te kopiëren",
              "en": "Hold the Ctrl key before moving elements to copy them"
            },
            "board_simplified":{
              "fr": "Elements simplifiés",
              "nl": "Vereenvoudigde elementen",
              "en": "Simplified elements"
            },
          },




          "draft":{
            "ongoing_projects":{
              "fr": "Projets en cours",
              "nl": "Projecten in uitvoering",
              "en": "On going projects"
            },
            "archived_projects":{
              "fr": "Projets archivés",
              "nl": "Gearchiveerde projecten",
              "en": "Archived projects"
            },
            "create_new_project":{
              "fr": "Créer un nouveau projet",
              "nl": "Creëer een nieuw project.",
              "en": "Create a new project"
            },
            "tip_no_ongoing_project":{
              "fr": "Il n'y a pas de projet en cours.",
              "nl": "Er is geen lopend project.",
              "en": "There is no on going project."
            },
            "tip_create_new_project":{
              "fr": "Créez-en un nouveau en cliquant sur le bouton « + ».",
              "nl": "Creëer een nieuwe door de « + » knop te kliken.",
              "en": "Create one by clicking on the button « + »."
            },
            "tip_no_archived_project":{
              "fr": "Il n'y a pas de projet archivé.",
              "nl": "Er is geen gearchiveerd project.",
              "en": "There is no archived project."
            },
            "project_name":{
              "fr": "Nom du projet",
              "nl": "De naam van het project",
              "en": "Project's name"
            },
            "project_date":{
              "fr": "Début du projet",
              "nl": "Start van het project",
              "en": "Project's start date"
            },
            "add_task":{
              "fr": "Ajouter une tâche",
              "nl": "Voeg een taak toe.",
              "en": "Add task"
            },
            "edit_project":{
              "fr": "Editer le projet",
              "nl": "Berwerk het project",
              "en": "Edit project"
            },
            "ongoing":{
              "fr": "En cours",
              "nl": "Bezig",
              "en": "On going"
            },
            "archived":{
              "fr": "Archivé",
              "nl": "Gearchiveerd",
              "en": "Archived"
            },
            "private":{
              "fr": "Privé",
              "nl": "Privé",
              "en": "Private"
            },
            "public":{
              "fr": "Public",
              "nl": "Publiek",
              "en": "public"
            },
            "delete_project":{
              "fr": "Supprimer le projet",
              "nl": "Verwijder het project",
              "en": "Delete project"
            },
            "delete_project_warning":{
              "fr": "Attention, tous les éléments de ce projet seront supprimés de façon permanente.",
              "nl": "Opgelet, alle elementenvan dit project permanenent verwijderd worden.",
              "en": "Delete project"
            },
            "delete_project_info":{
              "fr": "Si un projet est terminé, vous pouvez aussi l'archiver. Vous concerverez ainsi le projet, mais il n'apparaîtra plus dans la liste des projets en cours.",
              "nl": "Als dit project gedaan is mag je deze ook archiveren. Op deze manier behoud u dit project maar deze zal niet meer tevoorschijn komen bij de lopende projecten.",
              "en": "Delete project"
            },
            "private_hint":{
              "fr": "Seules les personnes autorisées peuvent consulter ce projet.",
              "nl": "Alleen toegelaten personen kunnen dit project raadplegen.",
              "en": "Only authorized users can view this project."
            },
            "archived_hint":{
              "fr": "Le projet se trouve dans la liste des projets archivés.",
              "nl": "Het project staat in de lijst van gearchiveerde projecten.",
              "en": "The project is in the list of archived projects."
            },
            "tip_no_filtered_task":{
              "fr": "Il n'y a pas de tâche correspondante aux filtres sélectionnés",
              "nl": "Er is geen taak die overeenkomt met de geselecteerde filters.",
              "en": "There is no task corresponding to the selected filters"
            },
            "tip_no_task_1":{
              "fr": "Il n'y a pas encore de tâche dans ce projet.",
              "nl": "Er is nog geen taak in dit project.",
              "en": "There is no task in this project yet."
            },
            "tip_no_task_2":{
              "fr": "Pour en ajouter, activez le mode édition en cliquant sur le bouton en bas à droite de la page puis sur le bouton « + ».",
              "nl": "Om toe te voegen, de edit modus te activeren door de knop op de bodem te kliken en dan op de \"p\" knop.",
              "en": "To add some, enable the edit mode by clicking on the button at the bottom right of the page then on the button « + »."
            },
            "enable_edit_mode":{
              "fr": "Basculer en mode édition",
              "nl": "Bewerkingsmodus inschakelen",
              "en": "Enable edit mode"
            },
            "disable_edit_mode":{
              "fr": "Désactiver le mode édition",
              "nl": "Bewerkingsmodus uitschakelen",
              "en": "Disable edit mode"
            },
            "task_name":{
              "fr": "Nom de la tâche",
              "nl": "De naam van de taak",
              "en": "Tsak name"
            },
            "task_status":{
              "fr": "Statut",
              "nl": "Status",
              "en": "Status"
            },
            "initial_order":{
              "fr": "Ordre initial",
              "nl": "Initieel order",
              "en": "Initial order"
            },
            "task_models":{
              "fr": "Modèles de tâche",
              "nl": "Taak modellen",
              "en": "Task models"
            },
            "add_template":{
              "fr": "Créer un modèle",
              "nl": "Creëer een model",
              "en": "Create model"
            },
            "no_template":{
              "fr": "Il n'y a pas encore de modèle.",
              "nl": "Er is nog geen model.",
              "en": "There is no model yet."
            }
          }
        }
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
