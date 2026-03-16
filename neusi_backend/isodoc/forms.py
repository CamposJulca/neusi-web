from django import forms
from .models import Documento, VersionDocumento, Categoria


class DocumentoForm(forms.ModelForm):
    class Meta:
        model  = Documento
        fields = ('nombre', 'descripcion', 'categoria', 'estado', 'grupos_acceso')
        widgets = {
            'nombre':      forms.TextInput(attrs={'class': 'form-input', 'placeholder': 'Nombre del documento'}),
            'descripcion': forms.Textarea(attrs={'class': 'form-input', 'rows': 3, 'placeholder': 'Descripción breve'}),
            'categoria':   forms.Select(attrs={'class': 'form-input'}),
            'estado':      forms.Select(attrs={'class': 'form-input'}),
            'grupos_acceso': forms.CheckboxSelectMultiple(),
        }


class SubirVersionForm(forms.ModelForm):
    class Meta:
        model  = VersionDocumento
        fields = ('version', 'archivo', 'comentario', 'es_vigente')
        widgets = {
            'version':    forms.TextInput(attrs={'class': 'form-input', 'placeholder': 'ej: 1.0, 2.1'}),
            'comentario': forms.Textarea(attrs={'class': 'form-input', 'rows': 3,
                                                'placeholder': 'Cambios incluidos en esta versión'}),
            'es_vigente': forms.CheckboxInput(attrs={'class': 'form-checkbox'}),
        }

    def clean_archivo(self):
        archivo = self.cleaned_data.get('archivo')
        if archivo:
            if not archivo.name.lower().endswith('.pdf'):
                raise forms.ValidationError('Solo se permiten archivos PDF.')
            if archivo.size > 50 * 1024 * 1024:  # 50 MB
                raise forms.ValidationError('El archivo no puede superar 50 MB.')
        return archivo
