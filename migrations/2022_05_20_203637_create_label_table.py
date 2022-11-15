from orator.migrations import Migration


class CreateLabelTable(Migration):

    def up(self):
        """
        Run the migrations.
        """
        with self.schema.create('label') as table:
            table.increments('id')
            table.string('name', 50).default('')
            table.timestamps()

    def down(self):
        """
        Revert the migrations.
        """
        pass
