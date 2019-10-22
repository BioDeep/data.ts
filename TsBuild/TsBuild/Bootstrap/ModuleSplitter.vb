﻿Imports System.Runtime.CompilerServices
Imports Microsoft.VisualBasic.ComponentModel.DataSourceModel
Imports Microsoft.VisualBasic.Language
Imports Microsoft.VisualBasic.Text

Namespace Bootstrap

    Module ModuleSplitter

        ''' <summary>
        ''' 将bootstrap应用模块解析出来
        ''' </summary>
        ''' <param name="tokens"></param>
        ''' <param name="sourceJs$"></param>
        ''' <returns></returns>
        <Extension>
        Public Iterator Function PopulateModules(tokens As IEnumerable(Of Token), sourceJs$) As IEnumerable(Of NamedValue(Of String))
            ' app模块在编译出来的js文件中是从最顶层的declare起始的
            Dim modTokens As New List(Of Token)
            Dim stack As New Stack(Of Integer)
            Dim start%, len%
            Dim jsBlock$
            Dim ref$
            Dim appName$

            sourceJs = sourceJs.LineTokens.JoinBy(ASCII.LF)

            For Each t As Token In tokens
                If t.type = TypeScriptTokens.declare AndAlso stack.Count = 0 AndAlso modTokens > 0 Then
                    ' 这个可能是最顶层的模块申明
                    If modTokens.isModuleDefinition Then
                        start = modTokens.First.start
                        len = modTokens.Last.ends - modTokens.First.start
                        jsBlock = sourceJs.Substring(start, len)
                        appName = modTokens.getAppName
                        ref = modTokens.getModuleReference

                        Yield New NamedValue(Of String) With {
                            .Description = appName,
                            .Name = ref,
                            .Value = jsBlock
                        }
                    Else
                        modTokens *= 0
                    End If
                ElseIf t.type = TypeScriptTokens.openStack Then
                    stack.Push(t.start)
                ElseIf t.type = TypeScriptTokens.closeStack Then
                    stack.Pop()
                End If

                modTokens += t
            Next
        End Function

        <Extension>
        Private Function getAppName(modTokens As List(Of Token)) As String

        End Function

        <Extension>
        Private Function getModuleReference(modTokens As List(Of Token)) As String

        End Function

        <Extension>
        Private Function isModuleDefinition(modTokens As List(Of Token)) As Boolean

        End Function
    End Module
End Namespace