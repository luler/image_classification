from orator.migrations import Migration


class CreateImageTable(Migration):

    def up(self):
        """
        Run the migrations.
        """
        with self.schema.create('image') as table:
            table.increments('id')
            table.integer('label_id').default(0)
            table.string('name', 255).default('')
            table.string('path', 255).default('')
            table.string('ext', 50).default('')
            table.integer('size').default(0)
            table.string('md5').default('')
            table.timestamps()

    def down(self):
        """
        Revert the migrations.
        """
        pass
