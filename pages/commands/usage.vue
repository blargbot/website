<template>
  <div>
    <section>
      <h1>Commands</h1>
      <p>
        blargbot is equipped with a vast number of built-in commands for various purposes.
        To use a command, you must first use a command prefix in your message.
      </p>

      <div class="button-grid">
        <nuxt-link to="/commands" class="child-2 button shadow-2">
          View Commands
        </nuxt-link>
      </div>

      <h2>Prefixes</h2>
      <p>
        By default, blargbot responds to the prefixes <code>b!</code>, <code>blargbot</code>, and mentions.
        You can add custom prefixes both per-guild and personally - check out the <code>prefix</code> and <code>pprefix</code> commands!
      </p>

      <h2>Permissions</h2>
      <p>
        In general, commands are split into normal and admin commands.
        Normal commands can be executed by anyone, but admin commands have specific permission requirements.
      </p>
      <p>
        By default, the only people who are able to use admin commands are the server owner and
        anyone with the administrator permission. This can be configured in terms of both permissions
        and roles, using the <code>settings</code> command.
      </p>
      <p>
        An 'admin role' can be set (<code>b!settings set ADMINROLE &lt;role name&gt;</code>).
        Anyone with this role will be able to use admin commands, regardless of what permissions they have.
      </p>
      <p>
        There's also a 'permission overwrite' system (<code>b!setting set PERMOVERRIDE true</code>).
        The default staff permission configuration allows anyone with any of the following permissions is considered to be an admin:
      </p>
      <ul>
        <li>Administrator</li>
        <li>Manage Channels</li>
        <li>Manage Server</li>
        <li>Kick Members</li>
        <li>Ban Members</li>
        <li>Manage Messages</li>
      </ul>
      <p>
        Additionally, the permission and/or role requirements can be set per-command using the <code>editcommand</code> command.
      </p>
      <p>
        Finally, some commands have special permission requirements. For example, to use the <code>ban</code> command,
        you not only need to be considered an admin, but also need the Ban Members permission. This is to prevent abuse,
        and can be controlled using the <code>KICKOVERRIDE</code> and <code>BANOVERRIDE</code> settings.
      </p>

      <h2>Flags</h2>
      <p>
        blargbot offers a robust flag system for using commands. This is useful for when you need to
        provide a lot of information to a command, where positional arguments would get confusing.
      </p>
      <p>
        Flags are unix-like. There's two ways to provide flags: long (ex. <code>--flag</code>) and short (ex. <code>-f</code>).
        Sometimes the existence of a flag is enough for a command, but other times you'll need to provide a value (ex. <code>--flag content</code>).
      </p>
      <p>
        Short flags can also be chained. For example, <code>-flag</code> would be equivalent to
        writing <code>-f -l -a -g</code>. You can't provide content to chained flags, except for the last one provided.
      </p>

      <p>
        If you ever want to provide positional arguments <i>after</i> providing flags, just use an empty <code>--</code>.
      </p>

      <h2>Reading Usage Docs</h2>
      <p>When reading about how a command is used, keep in mind the following:</p>
      <ul>
        <li><code>&lt;arg&gt;</code> - The argument is required</li>
        <li><code>[arg]</code> - The argument is optional</li>
        <li><code>...arg</code> - The argument is provided multiple times</li>
      </ul>

      <div class="button-grid">
        <nuxt-link to="/commands" class="child-2 button shadow-2">
          View Commands
        </nuxt-link>
      </div>
    </section>
  </div>
</template>

<script>
export default {}
</script>
