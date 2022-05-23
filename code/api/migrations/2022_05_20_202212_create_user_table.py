from orator.migrations import Migration


class CreateUserTable(Migration):

    def up(self):
        """
        Run the migrations.
        """
        with self.schema.create('user') as table:
            table.increments('id')
            table.string('name', 50).default('')
            table.string('password', 50).default('')
            table.string('desc', 255).default('')
            table.timestamps()

    def down(self):
        """
        Revert the migrations.
        """
        pass
