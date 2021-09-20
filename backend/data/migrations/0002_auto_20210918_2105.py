# Generated by Django 3.2.7 on 2021-09-18 19:05

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('data', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Brand',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=60)),
            ],
        ),
        migrations.AlterField(
            model_name='store',
            name='brand',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='data.brand'),
        ),
    ]